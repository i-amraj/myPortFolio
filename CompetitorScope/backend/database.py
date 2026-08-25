from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from sqlalchemy import create_engine, Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from backend.config import DATABASE_URL

# Mentor Node: We use SQLite with check_same_thread=False for async FastAPI application,
# but we enforce a single session creator to prevent database locks.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Company(Base):
    __tablename__ = "companies"
    # Using Google's Place ID (string) directly as the ID prevents extra mapping complexity.
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    website = Column(String, nullable=True)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    business_type = Column(String, nullable=False)
    linkedin_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    details = relationship("CompanyDetails", uselist=False, back_populates="company", cascade="all, delete-orphan")
    team = relationship("TeamInsights", uselist=False, back_populates="company", cascade="all, delete-orphan")

class CompanyDetails(Base):
    __tablename__ = "company_details"
    company_id = Column(String, ForeignKey("companies.id"), primary_key=True)
    cin = Column(String, nullable=True)
    gst = Column(String, nullable=True)
    incorporation_date = Column(String, nullable=True)
    address = Column(String, nullable=True)
    status = Column(String, nullable=True)
    fetched_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="details")

class TeamInsights(Base):
    __tablename__ = "team_insights"
    company_id = Column(String, ForeignKey("companies.id"), primary_key=True)
    total_estimate = Column(Integer, nullable=True)
    linkedin_range = Column(String, nullable=True)
    epfo_count = Column(Integer, nullable=True)
    dev_count = Column(Integer, nullable=True)
    sales_count = Column(Integer, nullable=True)
    marketing_count = Column(Integer, nullable=True)
    fetched_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="team")

def init_db():
    # Mentor Node: Auto-creates tables if they do not exist.
    Base.metadata.create_all(bind=engine)

# Cache check helper
def is_cache_valid(fetched_at: Optional[datetime], max_age_days: int = 30) -> bool:
    # Mentor Node: Cache is checked by checking if fetched_at is within the last 30 days.
    if not fetched_at:
        return False
    return datetime.utcnow() - fetched_at < timedelta(days=max_age_days)

# Helper functions for company queries and caching
def save_companies(companies_list: List[Dict[str, Any]]):
    db = SessionLocal()
    try:
        for c in companies_list:
            company = db.query(Company).filter(Company.id == c["id"]).first()
            if not company:
                company = Company(
                    id=c["id"],
                    name=c["name"],
                    website=c.get("website"),
                    city=c["city"],
                    state=c["state"],
                    business_type=c["business_type"],
                    linkedin_url=c.get("linkedin_url")
                )
                db.add(company)
            else:
                # Update details if changed
                company.name = c["name"]
                if "website" in c:
                    company.website = c["website"]
                if "linkedin_url" in c:
                    company.linkedin_url = c["linkedin_url"]
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

def get_company(company_id: str) -> Optional[Dict[str, Any]]:
    db = SessionLocal()
    try:
        company = db.query(Company).filter(Company.id == company_id).first()
        if company:
            return {
                "id": company.id,
                "name": company.name,
                "website": company.website,
                "city": company.city,
                "state": company.state,
                "business_type": company.business_type,
                "linkedin_url": company.linkedin_url,
                "created_at": company.created_at.isoformat() if company.created_at else None
            }
        return None
    finally:
        db.close()

def get_cached_details(company_id: str) -> Optional[Dict[str, Any]]:
    db = SessionLocal()
    try:
        details = db.query(CompanyDetails).filter(CompanyDetails.company_id == company_id).first()
        if details and details.cin and is_cache_valid(details.fetched_at):
            return {
                "company_id": details.company_id,
                "cin": details.cin,
                "gst": details.gst,
                "incorporation_date": details.incorporation_date,
                "address": details.address,
                "status": details.status,
                "fetched_at": details.fetched_at.isoformat() if details.fetched_at else None
            }
        return None
    finally:
        db.close()

def save_details(company_id: str, details_data: Dict[str, Any]) -> Dict[str, Any]:
    db = SessionLocal()
    try:
        details = db.query(CompanyDetails).filter(CompanyDetails.company_id == company_id).first()
        if not details:
            details = CompanyDetails(company_id=company_id)
            db.add(details)
        
        details.cin = details_data.get("cin")
        details.gst = details_data.get("gst")
        details.incorporation_date = details_data.get("incorporation_date")
        details.address = details_data.get("address")
        details.status = details_data.get("status")
        details.fetched_at = datetime.utcnow()
        db.commit()
        
        return {
            "company_id": details.company_id,
            "cin": details.cin,
            "gst": details.gst,
            "incorporation_date": details.incorporation_date,
            "address": details.address,
            "status": details.status,
            "fetched_at": details.fetched_at.isoformat()
        }
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

def get_cached_team(company_id: str) -> Optional[Dict[str, Any]]:
    db = SessionLocal()
    try:
        team = db.query(TeamInsights).filter(TeamInsights.company_id == company_id).first()
        if team and team.total_estimate is not None and is_cache_valid(team.fetched_at):
            company = db.query(Company).filter(Company.id == company_id).first()
            linkedin_url = company.linkedin_url if company else None
            return {
                "company_id": team.company_id,
                "total_estimate": team.total_estimate,
                "linkedin_range": team.linkedin_range,
                "epfo_count": team.epfo_count,
                "dev_count": team.dev_count,
                "sales_count": team.sales_count,
                "marketing_count": team.marketing_count,
                "linkedin_url": linkedin_url,
                "fetched_at": team.fetched_at.isoformat() if team.fetched_at else None
            }
        return None
    finally:
        db.close()

def save_team(company_id: str, team_data: Dict[str, Any]) -> Dict[str, Any]:
    db = SessionLocal()
    try:
        team = db.query(TeamInsights).filter(TeamInsights.company_id == company_id).first()
        if not team:
            team = TeamInsights(company_id=company_id)
            db.add(team)
        
        team.total_estimate = team_data.get("total_estimate")
        team.linkedin_range = team_data.get("linkedin_range")
        team.epfo_count = team_data.get("epfo_count")
        team.dev_count = team_data.get("dev_count")
        team.sales_count = team_data.get("sales_count")
        team.marketing_count = team_data.get("marketing_count")
        team.fetched_at = datetime.utcnow()
        
        # Save linkedin_url to Company table
        company = db.query(Company).filter(Company.id == company_id).first()
        if company and team_data.get("linkedin_url"):
            company.linkedin_url = team_data.get("linkedin_url")
            
        db.commit()
        
        return {
            "company_id": team.company_id,
            "total_estimate": team.total_estimate,
            "linkedin_range": team.linkedin_range,
            "epfo_count": team.epfo_count,
            "dev_count": team.dev_count,
            "sales_count": team.sales_count,
            "marketing_count": team.marketing_count,
            "linkedin_url": company.linkedin_url if company and company.linkedin_url else team_data.get("linkedin_url"),
            "fetched_at": team.fetched_at.isoformat()
        }
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
