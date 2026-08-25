# Rules for AI Assistant

## Allowed Libraries ONLY
- Backend: fastapi, uvicorn, httpx, beautifulsoup4, sqlalchemy, python-dotenv
- Frontend: Tailwind CSS via CDN, Three.js via CDN, vanilla JS only
- Do NOT introduce: React, Vue, Node.js tooling, Selenium, Playwright,
  Scrapy, pandas, or any paid SDK without asking first.

## Hard Boundaries (NEVER violate)
1. NEVER use LinkedIn login, cookies, or session tokens for scraping.
2. NEVER collect/store personal data of individuals (names, emails,
   personal profile URLs). Aggregate numbers only.
3. NEVER hardcode API keys in code. Always read from .env via config.py.
4. NEVER commit .env or companies.db (must be in .gitignore).
5. NEVER remove the rate-limiting delays between external requests.
6. NEVER build hosting/deployment config (Docker, CI/CD) unless asked.

## Error Handling Pattern
- Every external call (API/scrape) wrapped in try/except.
- On failure: return partial data with a "sources_failed" list in the
  JSON response, never crash the endpoint.
- Log errors to console with source name and reason.
- Frontend must show "Data unavailable from X source" gracefully.

## Code Style
- Python: type hints on all functions, small functions (< 40 lines).
- JS: no frameworks, use fetch() with async/await, one function per task.
- Comments in English, simple language.

## Behavior Rules
- Follow Phases.md strictly. Do not jump ahead to a later phase.
- Before writing code, state which phase and which file you are editing.
- After completing work, update Memory.md.
- If a data source is blocked/unavailable, suggest fallback, don't fake data.
