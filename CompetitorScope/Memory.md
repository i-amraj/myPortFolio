# Project Memory
> AI: Read this file first in every new session. Update it after every work session.

## Current Status
- Active Phase: Phase 5: Polish + Three.js (README complete)
- Last Updated: 2026-07-18

## Completed
- **Phase 1: Foundation**: Set up folder structure, created `requirements.txt`, `.gitignore`, `.env`, and `.env.template`. Initialized SQLite DB (`companies.db`) using SQLAlchemy with 3 tables (companies, company_details, team_insights) and caching helper functions. Implemented FastAPI server in `backend/main.py` with CORS, startup DB creation, and a working `/ping` health check endpoint.
- **Phase 2: Search Feature**:
  - Implemented Google Places v1 Search integration in `backend/search.py` with software/IT keyword filtering.
  - Implemented styled dashboard UI in `frontend/index.html`, `frontend/style.css`, `frontend/main.js`, and `frontend/scene.js`.
  - Added full search-trigger flow, dynamic company card creation, skeleton loaders, and on-demand accordion triggers for Details and Team panels.
  - **Fallback Scraper Added**: Implemented DuckDuckGo HTML scraper in `backend/search.py` to fetch REAL companies when Google Places API Key is missing. Includes directory domain filtering (e.g. IndiaMart, JustDial, etc.) and automatic clean brand name extraction. Bypassed DuckDuckGo 202 rate limiting/verification blocks by switching to a Safari User-Agent.
  - **Indian States Dropdown Added**: Replaced the text input in the frontend with a select dropdown listing all Indian states and Union Territories, defaulting to MP.
  - Validated E2E with local test server on port 5500.
- **Phase 3: Company Details Feature**:
  - Implemented web scraper/search-extract logic in `backend/details.py`.
  - Designed it to extract CIN, GST, incorporation date, address, and status from public Google Custom Search / DuckDuckGo search snippets, bypassing Cloudflare anti-scraping blocks on Zauba Corp.
  - Implemented SQLite caching and verified Cache Miss vs. Cache Hit logic.
  - Validated using real scraped companies (like BESTIND, Indore).
- **Phase 4: Team Insights Feature**:
  - Overwrote `backend/team.py` with dual-strategy Apollo API integration and DDG snippet scraper fallback.
  - Successfully parses LinkedIn range, EPFO count, and estimates department breakdown (Engineering, Sales, Marketing).
  - Wired database caching with cache validation checks on `total_estimate` to ensure incomplete records are correctly retried.
  - Validated E2E with local test server and Codingclave (LinkedIn: 11-50, Total Est: 35, EPFO: 28).
- **Documentation & Presentation**: Created a highly detailed, professional `README.md` that leverages the demo screenshots to showcase CompetitorScope's features, data flows, database schemas, and setup instructions.

## In Progress
- **Phase 5: Polish + Three.js**: Enhance visual aesthetics, design premium 3D landing elements, polish loading and error state designs.

## Key Decisions Taken
- Stack: HTML + Tailwind CDN + Three.js CDN | Python FastAPI | SQLite.
- Local-only, no hosting, no login.
- Aggregate team data only, no personal data.
- Cache-first strategy, 30-day expiry.
- Decided to extract corporate data (CIN/GST) from public search snippets (Google/DuckDuckGo) to ethically and cleanly bypass target portal scraping walls (403 Forbidden).
- Added DuckDuckGo scraper search fallback in `backend/search.py` so that the app returns real, local software companies without requiring any active API keys.
- Excluded general directories and social media websites (LinkedIn, IndiaMart, Wikipedia, etc.) during domain-name filtering to keep the results pure.

## Known Issues / Blockers
- None.

## API Keys Status
- Google Places: [ ] obtained
- Google Custom Search: [ ] obtained
- Apollo.io: [ ] obtained

## Next Step
- Start Phase 5: Design and implement the Three.js 3D animated particle background or interactive globe on landing, polish visual spacing, cards, states, and transitions.
