import os
from supabase import create_client  # type: ignore
from dotenv import load_dotenv  # type: ignore

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY"),
)
