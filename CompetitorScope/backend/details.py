import re
import logging
import asyncio
import random
import httpx
import urllib.parse
from bs4 import BeautifulSoup
from typing import Optional, Dict, Any

from backend.config import GOOGLE_CUSTOM_SEARCH_API_KEY, GOOGLE_SEARCH_ENGINE_ID
from backend.database import get_company

logger = logging.getLogger("competitor-scope.details")

# Regex patterns
# Match 21-digit Corporate Identification Number (CIN)
CIN_PATTERN = re.compile(r'\b([UPL]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6})\b', re.IGNORECASE)

# Match 15-digit Goods and Services Tax Identification Number (GSTIN)
GST_PATTERN = re.compile(r'\b(\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1})\b', re.IGNORECASE)

# Match capitalization and legal suffix (e.g. Prayosha Food Services Pvt. Ltd) to resolve parent company
LEGAL_NAME_PATTERN = re.compile(
    r'\b((?:[A-Z][a-zA-Z0-9\&,\.-]*\s+){1,5}(?:Private Limited|Pvt\.?\s*Ltd\.?|Limited|Ltd\.?|LLP))\b'
)

# Match standard Indian incorporation date patterns (e.g. 19th May, 2011 or 12-04-2022)
INC_DATE_PATTERN = re.compile(
    r'(?:incorporated|registered|established|founded)(?:\s+with\s+MCA)?\s+on\s+([\d]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+,?\s+\d{4}|\d{1,2}[-/]\d{1,2}[-/]\d{4}|\d{4}-\d{2}-\d{2})',
    re.IGNORECASE
)

# Match addresses greedy until period
ADDRESS_PATTERN = re.compile(
    r'(?:registered office in|registered office|office in|address is|address in)\s+([^.]+)',
    re.IGNORECASE
)

async def scrape_company_details(company_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieves company details (CIN, GST, incorporation date, address, status) on-demand.
    Uses Google Custom Search API or falls back to DuckDuckGo HTML Search.
    Implements a two-step brand-to-legal-name resolution and extracts CIN from Zauba URLs.
    """
    # 1. Handle mock companies immediately to speed up local testing
    if company_id.startswith("mock_place_"):
        logger.info(f"Mock company ID detected: {company_id}. Returning mock details.")
        return {
            "cin": "U72900MP2022PTC" + str(random.randint(100000, 999999)),
            "gst": "23AACCI" + str(random.randint(1000, 9999)) + "F1Z" + random.choice("12345"),
            "incorporation_date": "2022-04-12",
            "address": "123, Vijay Nagar, Indore, MP, 452010",
            "status": "Active"
        }

    company = get_company(company_id)
    company_name = company["name"] if company else "Software Company"
    logger.info(f"Fetching details for: '{company_name}' ({company_id})")

    # Rate limiting delay as per Rules.md
    await asyncio.sleep(random.uniform(3.0, 5.0))

    cin, gst, inc_date, address, status = None, None, None, None, "Active"
    legal_name = None

    async def run_search_extract(query_str: str):
        nonlocal cin, gst, inc_date, address, legal_name
        
        snippets = []
        urls = []
        
        # Try Google Custom Search first
        if GOOGLE_CUSTOM_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID:
            try:
                logger.info(f"Google Custom Search: '{query_str}'")
                search_results = await _fetch_google_custom_search(query_str)
                snippets = [item.get("snippet", "") for item in search_results]
                urls = [item.get("link", "") for item in search_results]
            except Exception as e:
                logger.error(f"Google Search failed: {e}")
                
        # Fallback to DuckDuckGo HTML Search
        if not snippets:
            try:
                logger.info(f"DuckDuckGo Search: '{query_str}'")
                ddg_results = await _fetch_ddg_search_extended(query_str)
                snippets = [res["snippet"] for res in ddg_results]
                urls = [res["url"] for res in ddg_results]
            except Exception as e:
                logger.error(f"DuckDuckGo Search failed: {e}")

        # Process results
        for url, snippet in zip(urls, snippets):
            # A. Extract CIN from Zauba URL if present (100% reliable)
            if "zaubacorp.com/company/" in url:
                parts = url.strip("/").split("/")
                if parts:
                    last_part = parts[-1].upper()
                    if CIN_PATTERN.match(last_part):
                        cin = last_part
                        logger.info(f"Extracted CIN from Zauba URL: {cin}")

            # B. Parse snippet for CIN
            if not cin:
                cin_match = CIN_PATTERN.search(snippet)
                if cin_match:
                    cin = cin_match.group(1).upper()
                    logger.info(f"Extracted CIN from snippet: {cin}")

            # C. Parse snippet for Incorporation Date
            if not inc_date:
                inc_match = INC_DATE_PATTERN.search(snippet)
                if inc_match:
                    inc_date = inc_match.group(1).strip()
                    logger.info(f"Extracted Incorporation Date: {inc_date}")

            # D. Parse snippet for Address
            if not address:
                addr_match = ADDRESS_PATTERN.search(snippet)
                if addr_match:
                    address = addr_match.group(1).strip()[:150]
                    logger.info(f"Extracted Address: {address}")

            # E. Parse status
            if "strike off" in snippet.lower() or "dissolved" in snippet.lower():
                status = "Strike Off"
            elif "inactive" in snippet.lower():
                status = "Inactive"

            # F. Extract legal name candidate
            if not cin and not legal_name:
                name_match = LEGAL_NAME_PATTERN.search(snippet)
                if name_match:
                    legal_name = name_match.group(1).strip()
                    # Clean up multiple whitespaces
                    legal_name = re.sub(r'\s+', ' ', legal_name)
                    logger.info(f"Extracted Legal Name Candidate: {legal_name}")

    # 1. Search for brand name
    await run_search_extract(f"{company_name} zaubacorp")

    # 2. If legal name is found but no CIN was resolved, refine the search
    if legal_name and not cin:
        logger.info(f"Refining search using legal name candidate: '{legal_name}'")
        await asyncio.sleep(random.uniform(3.0, 5.0))
        await run_search_extract(f"{legal_name} zaubacorp")

    # 3. Search for GST number using company name/CIN
    await asyncio.sleep(random.uniform(3.0, 5.0))
    gst_query = f"{company_name} GST number"
    gst_snippets = []
    
    if GOOGLE_CUSTOM_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID:
        try:
            results = await _fetch_google_custom_search(gst_query)
            gst_snippets = [item.get("snippet", "") for item in results]
        except Exception:
            pass
            
    if not gst_snippets:
        try:
            ddg_results = await _fetch_ddg_search_extended(gst_query)
            gst_snippets = [res["snippet"] for res in ddg_results]
        except Exception:
            pass

    for snippet in gst_snippets:
        gst_match = GST_PATTERN.search(snippet)
        if gst_match:
            gst = gst_match.group(1).upper()
            logger.info(f"Extracted GSTIN: {gst}")
            break

    # If parsing failed entirely, we return None (which is saved as N/A in DB)
    return {
        "cin": cin,
        "gst": gst,
        "incorporation_date": inc_date,
        "address": address,
        "status": status
    }

async def _fetch_google_custom_search(query: str) -> list:
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": GOOGLE_CUSTOM_SEARCH_API_KEY,
        "cx": GOOGLE_SEARCH_ENGINE_ID,
        "q": query
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(url, params=params)
        if response.status_code != 200:
            raise Exception(f"Google Search API returned status {response.status_code}")
        results = response.json()
        return results.get("items", [])

async def _fetch_ddg_search_extended(query: str) -> list:
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15",
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(url, headers=headers)
        if response.status_code != 200:
            raise Exception(f"DuckDuckGo returned status {response.status_code}")
        soup = BeautifulSoup(response.text, "html.parser")
        results = soup.find_all("div", class_="result")
        
        items = []
        for res in results:
            title_a = res.find("a", class_="result__a")
            snippet_el = res.find("a", class_="result__snippet")
            
            href = title_a["href"] if title_a and "href" in title_a.attrs else ""
            snippet = snippet_el.text.strip() if snippet_el else ""
            
            # Resolve DDG redirect wrapper
            real_url = href
            if "uddg=" in href:
                parsed_href = urllib.parse.urlparse(href)
                query_params = urllib.parse.parse_qs(parsed_href.query)
                if "uddg" in query_params:
                    real_url = query_params["uddg"][0]
                    
            items.append({
                "url": real_url,
                "snippet": snippet
            })
        return items
