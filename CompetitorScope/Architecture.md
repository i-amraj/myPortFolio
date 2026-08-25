# Architecture

## Tech Stack
- Frontend: HTML5, Tailwind CSS (CDN), Three.js (CDN), Vanilla JavaScript
- Backend: Python 3.11+, FastAPI, Uvicorn
- Database: SQLite (single file: companies.db)
- HTTP client: httpx | Parsing: BeautifulSoup4
- External APIs: Google Places API, Google Custom Search API, Apollo.io (free tier)

## Folder Structure
competitor-scope/
├── frontend/
│   ├── index.html        # Search form + results list + detail panels
│   ├── style.css         # Custom styles beyond Tailwind
│   ├── main.js           # UI logic, fetch calls to backend, rendering
│   └── scene.js          # Three.js landing background (3D scene only)
├── backend/
│   ├── main.py           # FastAPI app, routes, CORS setup
│   ├── search.py         # Google Places search + keyword filtering
│   ├── details.py        # CIN/GST scraping (Zauba, GST portal)
│   ├── team.py           # Apollo API + LinkedIn public preview + EPFO
│   ├── database.py       # SQLite connection, schema, cache helpers
│   └── config.py         # Loads .env (API keys)
├── companies.db          # SQLite database (auto-created)
├── .env                  # API keys (NEVER commit)
├── .gitignore
└── requirements.txt

## API Endpoints
| Method | Route                        | Purpose                              |
|--------|------------------------------|--------------------------------------|
| POST   | /search                      | {business, city, state} -> companies |
| GET    | /company/{id}/details        | CIN, GST, incorporation (cache-first)|
| GET    | /company/{id}/team           | Aggregate team numbers (cache-first) |

## Data Flow
1. User submits form -> frontend POST /search
2. Backend: check SQLite cache -> if miss, call Google Places ->
   filter by software/IT keywords -> save to DB -> return list
3. User clicks "Company Details" -> GET /company/{id}/details
   -> cache check -> if miss, scrape Zauba/GST -> save -> return
4. User clicks "Team Insights" -> GET /company/{id}/team
   -> cache check -> if miss, Apollo API + Google Custom Search
   (LinkedIn public snippet) + EPFO -> save -> return

## Database Schema
- companies(id, name, website, city, state, business_type,
  linkedin_url, created_at)
- company_details(company_id FK, cin, gst, incorporation_date,
  address, status, fetched_at)
- team_insights(company_id FK, total_estimate, linkedin_range,
  epfo_count, dev_count, sales_count, marketing_count, fetched_at)

## Cache Policy
- Cache-first on every details/team request
- Data older than 30 days (fetched_at) is re-fetched
- All external calls have a 3-5 second delay between requests (rate limiting)

## Local Run
- Backend: uvicorn backend.main:app --reload  (http://localhost:8000)
- Frontend: VS Code Live Server on index.html (http://localhost:5500)
- CORS: allow http://localhost:5500 in FastAPI middleware
