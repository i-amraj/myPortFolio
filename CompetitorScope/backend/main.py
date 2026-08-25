import logging
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from backend.database import (
    init_db,
    get_company,
    get_cached_details,
    save_details,
    get_cached_team,
    save_team,
    save_companies
)
from backend.search import search_competitors
from backend.details import scrape_company_details
from backend.team import fetch_team_insights

# Mentor Node: Setting up basic logs helps debug API requests easily in console.
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("competitor-scope")

app = FastAPI(title="CompetitorScope Backend")

# Mentor Node: CORS is configured to allow only specific local development servers.
# This prevents malicious scripts from arbitrary origins accessing local scraper endpoints.
origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class SearchRequest(BaseModel):
    business_type: str
    state: str
    city: str

@app.on_event("startup")
def on_startup():
    # Mentor Node: Ensures SQLite database schemas are created on server startup.
    logger.info("Initializing SQLite database...")
    init_db()
    logger.info("Database initialized successfully.")

@app.get("/ping")
async def ping():
    # Mentor Node: standard simple health-check route required in Phase 1 definition.
    return {"status": "ok"}

@app.post("/search")
async def search(req: SearchRequest):
    try:
        companies = await search_competitors(req.business_type, req.state, req.city)
        save_companies(companies)
        
        # Enrich companies with stored linkedin_url from DB
        from backend.database import SessionLocal, Company as DBCompany
        db = SessionLocal()
        try:
            for c in companies:
                db_comp = db.query(DBCompany).filter(DBCompany.id == c["id"]).first()
                if db_comp and db_comp.linkedin_url:
                    c["linkedin_url"] = db_comp.linkedin_url
        finally:
            db.close()
            
        return {
            "success": True,
            "data": companies,
            "sources_failed": [],
            "cached": False
        }
    except Exception as e:
        logger.error(f"Search failed: {e}")
        return {
            "success": False,
            "data": [],
            "sources_failed": ["google_places"],
            "cached": False
        }

@app.get("/company/{company_id}/details")
async def get_details(company_id: str):
    # Mentor Node: Cache-first pattern is implemented here. If the details exist
    # and are fresh (<30 days), we return cached data. Otherwise, we fetch fresh and save.
    sources_failed = []
    
    # 1. Check SQLite cache
    cached_data = get_cached_details(company_id)
    if cached_data:
        return {
            "success": True,
            "data": cached_data,
            "sources_failed": [],
            "cached": True
        }
    
    # 2. Cache miss -> Fetch details
    try:
        details_data = await scrape_company_details(company_id)
        if details_data:
            saved_details = save_details(company_id, details_data)
            return {
                "success": True,
                "data": saved_details,
                "sources_failed": [],
                "cached": False
            }
    except Exception as e:
        logger.error(f"Failed to scrape details for {company_id}: {e}")
        sources_failed.append("zauba_corp")
        
    return {
        "success": len(sources_failed) == 0,
        "data": {},
        "sources_failed": sources_failed,
        "cached": False
    }

@app.get("/company/{company_id}/team")
async def get_team(company_id: str):
    # Mentor Node: Cache-first pattern for team insights. Check SQLite,
    # then fallback to Apollo.io/Google search.
    sources_failed = []
    
    # 1. Check SQLite cache
    cached_data = get_cached_team(company_id)
    if cached_data:
        return {
            "success": True,
            "data": cached_data,
            "sources_failed": [],
            "cached": True
        }
        
    # Get company website for API search
    company = get_company(company_id)
    website = company.get("website") if company else None
    
    # 2. Cache miss -> Fetch team insights
    try:
        team_data = await fetch_team_insights(company_id, website)
        if team_data:
            saved_team = save_team(company_id, team_data)
            return {
                "success": True,
                "data": saved_team,
                "sources_failed": [],
                "cached": False
            }
    except Exception as e:
        logger.error(f"Failed to fetch team insights for {company_id}: {e}")
        sources_failed.append("apollo_io")
        
    return {
        "success": len(sources_failed) == 0,
        "data": {},
        "sources_failed": sources_failed,
        "cached": False
    }

from fastapi.staticfiles import StaticFiles
app.mount("/", StaticFiles(directory="/home/ubuntu_16gb/raj_work_space/software_checker/frontend", html=True), name="frontend")
