from fastapi import APIRouter  # type: ignore
from database import supabase

router = APIRouter()


@router.get("/leaderboard")
def get_leaderboard():
    response = (
        supabase.table("profiles")
        .select("username, total_points")
        .order("total_points", desc=True)
        .limit(5)
        .execute()
    )
    return [
        {"rank": i + 1, "username": r["username"] or "Anonymous", "points": r["total_points"] or 0}
        for i, r in enumerate(response.data)
    ]
