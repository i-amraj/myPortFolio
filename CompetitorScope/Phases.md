# Project Phases

## Phase 1: Foundation (setup + database)
- Create folder structure as per Architecture.md
- requirements.txt, .env template, .gitignore
- database.py: SQLite schema creation (3 tables), cache helper functions
- main.py: FastAPI app with CORS, health check route GET /ping
- DONE when: server runs, /ping returns {"status": "ok"}, DB file created

## Phase 2: Search Feature
- search.py: Google Places API integration + software/IT keyword filter
- POST /search endpoint with SQLite caching
- index.html: search form (business, state, city) with Tailwind
- main.js: form submit -> fetch -> render company cards with 2 buttons
- DONE when: real companies appear for a test search (e.g., Indore)

## Phase 3: Company Details Feature
- details.py: Zauba Corp public page scraping (CIN, incorporation, address)
  + GST lookup
- GET /company/{id}/details endpoint, cache-first
- Frontend: "Company Details" button -> loading spinner -> detail panel
- DONE when: clicking button shows real CIN/GST, second click is instant

## Phase 4: Team Insights Feature
- team.py: Apollo.io API (department counts) + Google Custom Search
  (LinkedIn public size range) + EPFO count
- GET /company/{id}/team endpoint, cache-first
- Frontend: "Team Insights" button -> aggregate numbers panel
- DONE when: team size shows from at least 2 sources

## Phase 5: Polish + Three.js
- scene.js: 3D animated background on landing (particles or globe)
- Loading states, error messages, empty-state designs
- Design.md color/typography applied everywhere
- DONE when: full flow works end-to-end smoothly on localhost

## Rule
Complete and test each phase before starting the next.
One phase = one working, testable milestone.
