import logging
import httpx
import urllib.parse
import re
import asyncio
from typing import List, Dict, Any
from bs4 import BeautifulSoup
from backend.config import GOOGLE_PLACES_API_KEY

logger = logging.getLogger("competitor-scope.search")

# B2B directories, job sites, and social networks to exclude from real company results
DIRECTORY_DOMAINS = {
    "indiamart.com", "justdial.com", "tradeindia.com", "exportersindia.com",
    "sulekha.com", "yellowpages.com", "wikipedia.org", "linkedin.com",
    "facebook.com", "glassdoor.co.in", "glassdoor.com", "indeed.com",
    "ambitionbox.com", "indiahix.com", "zaubacorp.com", "tofler.in",
    "easycompany.in", "company360.in", "crunchbase.com", "twitter.com",
    "youtube.com", "pinterest.com", "instagram.com", "github.com"
}

def clean_company_name(domain: str, title: str) -> str:
    """
    Extracts a clean, professional company name from the website domain
    and search result title.
    """
    # Try to parse domain to get a clean name
    # e.g., codingclave.com -> Codingclave, ecodedesign.in -> Ecodedesign
    name_part = domain.split(".")[0]
    if name_part.startswith("www"):
        name_part = domain.split(".")[1]
    
    # Capitalize the first letter
    company_name = name_part.capitalize()
    
    # Check if we can find a better capitalized name inside the search title
    # e.g., "Restaurant POS Software in Indore | Codingclave" -> Codingclave
    title_parts = re.split(r'[\-|\||:]', title)
    for part in title_parts:
        part_clean = part.strip()
        # If the part matches our domain-based name case-insensitively, use it
        if part_clean.lower() == name_part.lower():
            return part_clean
        # Or if it is a single/double word that doesn't contain generic keywords
        if len(part_clean.split()) <= 3 and name_part.lower() in part_clean.lower():
            return part_clean

    return company_name

async def search_competitors(business_type: str, state: str, city: str) -> List[Dict[str, Any]]:
    """
    Searches for software/IT companies for a given domain and location.
    If Google Places API Key is not configured, it scrapes public search results
    from DuckDuckGo, filters out directories, and extracts real local companies.
    """
    query = f"{business_type} software companies in {city}, {state}"
    logger.info(f"Initiating competitor search: '{query}'")

    # If no API key is provided, perform public search scraping for REAL companies
    if not GOOGLE_PLACES_API_KEY:
        logger.warning("GOOGLE_PLACES_API_KEY not configured. Scraping real companies from DuckDuckGo.")
        return await _search_via_ddg_scraping(business_type, state, city)

    # If API key is present, use Google Places API (New v1)
    return await _search_via_places_api(business_type, state, city)

async def _search_via_places_api(business_type: str, state: str, city: str) -> List[Dict[str, Any]]:
    url = "https://places.googleapis.com/v1/places:searchText"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.websiteUri,places.formattedAddress,places.types",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }
    
    body = {
        "textQuery": f"{business_type} software companies in {city}, {state}"
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(url, headers=headers, json=body)
            if response.status_code != 200:
                logger.error(f"Google Places API error {response.status_code}. Falling back to DDG scraping.")
                return await _search_via_ddg_scraping(business_type, state, city)
            
            response_data = response.json()
            places = response_data.get("places", [])
            
            results = []
            for place in places:
                place_id = place.get("id")
                display_name = place.get("displayName", {}).get("text", "")
                website = place.get("websiteUri")
                
                # Check domain to filter directories
                if website:
                    parsed_url = urllib.parse.urlparse(website)
                    domain = parsed_url.netloc.lower()
                    if any(dir_dom in domain for dir_dom in DIRECTORY_DOMAINS):
                        continue
                
                results.append({
                    "id": place_id,
                    "name": display_name,
                    "website": website,
                    "city": city,
                    "state": state,
                    "business_type": business_type,
                    "linkedin_url": None
                })
            return results
    except Exception as e:
        logger.error(f"Places API failed: {e}. Falling back to DDG scraping.")
        return await _search_via_ddg_scraping(business_type, state, city)

async def _search_via_ddg_scraping(business_type: str, state: str, city: str) -> List[Dict[str, Any]]:
    """
    Scrapes DuckDuckGo HTML search results for real software companies,
    filtering out generic directory/listing domains.
    """
    query = f"{business_type} software companies in {city} {state}"
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15",
    }
    
    results = []
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, headers=headers)
            if response.status_code != 200:
                logger.error(f"DuckDuckGo search returned HTTP status {response.status_code}")
                return []
            
            soup = BeautifulSoup(response.text, "html.parser")
            search_items = soup.find_all("div", class_="result")
            
            for item in search_items:
                title_a = item.find("a", class_="result__a")
                if not title_a:
                    continue
                
                title = title_a.text.strip()
                href = title_a.get("href", "")
                
                # Resolve DuckDuckGo redirect wrapper if present
                real_url = href
                if "uddg=" in href:
                    parsed_href = urllib.parse.urlparse(href)
                    query_params = urllib.parse.parse_qs(parsed_href.query)
                    if "uddg" in query_params:
                        real_url = query_params["uddg"][0]
                
                # Parse domain name to inspect
                parsed_url = urllib.parse.urlparse(real_url)
                domain = parsed_url.netloc.lower()
                if not domain:
                    continue
                
                # Strip 'www.' for checking directories
                check_domain = domain.replace("www.", "")
                
                # Filter out aggregates, directories, search engines
                if any(dir_dom in check_domain for dir_dom in DIRECTORY_DOMAINS):
                    continue
                
                # Deduplicate by domain
                if any(r["website"] and domain in r["website"] for r in results):
                    continue
                
                # Extract clean company name
                company_name = clean_company_name(check_domain, title)
                
                # Generate unique but stable ID based on company name domain slug
                domain_slug = re.sub(r'[^a-zA-Z0-9]', '_', check_domain)
                company_id = f"real_comp_{domain_slug}"
                
                results.append({
                    "id": company_id,
                    "name": company_name,
                    "website": real_url,
                    "city": city,
                    "state": state,
                    "business_type": business_type,
                    "linkedin_url": None
                })
                
                # Limit to top 15 results for performance and clean UI
                if len(results) >= 15:
                    break
                    
        logger.info(f"DuckDuckGo scraping found {len(results)} real companies.")
        return results
    except Exception as e:
        logger.error(f"DuckDuckGo scraping encountered error: {e}")
        return []
