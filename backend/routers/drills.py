from fastapi import APIRouter  # type: ignore
from database import supabase

router = APIRouter()


@router.get("/drills")
def get_drills():
    response = supabase.table("drills").select("*").order("sort_order").execute()
    return response.data
