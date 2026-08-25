# Product Requirements Document (PRD)

## Project Name
CompetitorScope - Local Competitor Intelligence Tool

## Problem Statement
Business owners and entrepreneurs cannot easily find out which IT/software
companies in a specific area are building and selling software for a given
business domain (e.g., restaurant software in Indore). Researching each
company's registration details and team size manually takes hours.

## Target Users
- Entrepreneurs planning to enter a software market in a specific city
- Small IT company owners researching local competitors
- Students/analysts doing market research

## Core Features

### F1: Company Search
- Input: Business type (e.g., "restaurant"), State, City
- Output: List of IT/software companies in that area related to that business
- Data source: Google Places API + keyword filtering
- Only company name, website, and city shown in the list (fast, lightweight)

### F2: Company Details (on-demand button)
- Button on each company card: "Company Details"
- On click, fetch and display: CIN number, GST number, incorporation date,
  registered address, company status
- Data sources: Zauba Corp public pages, GST portal
- Result is cached in SQLite. Second click = instant load from DB.

### F3: Team Insights (on-demand button)
- Button on each company card: "Team Insights"
- On click, fetch and display AGGREGATE numbers only:
  - Total employees (LinkedIn public size range)
  - EPFO registered employee count
  - Department breakdown estimate: developers, sales, marketing (Apollo.io)
- NO personal data: no names, no individual profiles, no personal LinkedIn IDs
- Result is cached in SQLite.

## Non-Goals (Out of Scope)
- No user login/authentication (single-user local tool)
- No hosting/deployment (runs on localhost only)
- No individual employee data collection
- No LinkedIn login-based scraping

## Success Criteria
- Search returns results in < 5 seconds
- Details/Team fetch completes in < 15 seconds (first time), < 1 second (cached)
- Works fully on a local machine with free-tier API keys only
