import os
from pathlib import Path
from dotenv import load_dotenv

# Mentor Node: We load the environment variables at startup so they are available globally.
# We resolve the path dynamically to handle different working directories.
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

# API Keys loaded from the system or .env file
GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY", "")
GOOGLE_CUSTOM_SEARCH_API_KEY = os.getenv("GOOGLE_CUSTOM_SEARCH_API_KEY", "")
GOOGLE_SEARCH_ENGINE_ID = os.getenv("GOOGLE_SEARCH_ENGINE_ID", "")
APOLLO_API_KEY = os.getenv("APOLLO_API_KEY", "")

# SQLite configuration
# Mentor Node: Storing DB at the root directory ensures it is easy to find and inspect locally.
DATABASE_URL = f"sqlite:///{BASE_DIR}/companies.db"
