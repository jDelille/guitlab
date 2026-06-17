from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from supabase import create_client  # type: ignore
import os 
from dotenv import load_dotenv # type: ignore

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

@app.get("/")
def read_root():
    return {"message": "Hello from the fretboard backend"}

@app.get("/drills")
def get_drills():
    response = supabase.table("drills").select("*").order("sort_order").execute()
    return response.data
