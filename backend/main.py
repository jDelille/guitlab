from fastapi import FastAPI, Header, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel # type: ignore
from supabase import create_client  # type: ignore
import os
from dotenv import load_dotenv # type: ignore

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

DIFFICULTY_MULTIPLIERS = {
    "Novice": 1.0,
    "Intermediate": 1.5,
    "Advanced": 2.0,
    "Expert": 3.0,
}

class DrillProgressBody(BaseModel):
    drill_id: str
    key: str
    shape: str
    scale: str
    score: int
    difficulty: str


def get_user_from_token(authorization: str | None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing auth token")
    token = authorization.split(" ")[1]
    try:
        response = supabase.auth.get_user(token)
        if not response.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return response.user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.get("/")
def read_root():
    return {"message": "Hello from the fretboard backend"}


@app.get("/drills")
def get_drills():
    response = supabase.table("drills").select("*").order("sort_order").execute()
    return response.data


@app.get("/leaderboard")
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


@app.get("/drill-progress")
def get_drill_progress(authorization: str | None = Header(None)):
    user = get_user_from_token(authorization)
    response = (
        supabase.table("drill_progress")
        .select("*")
        .eq("user_id", str(user.id))
        .execute()
    )
    return response.data


@app.post("/drill-progress")
def save_drill_progress(body: DrillProgressBody, authorization: str | None = Header(None)):
    user = get_user_from_token(authorization)

    multiplier = DIFFICULTY_MULTIPLIERS.get(body.difficulty, 1.0)

    existing = (
        supabase.table("drill_progress")
        .select("*")
        .eq("user_id", str(user.id))
        .eq("drill_id", body.drill_id)
        .eq("key", body.key)
        .eq("shape", body.shape)
        .eq("scale", body.scale)
        .execute()
    )

    if existing.data:
        record = existing.data[0]
        old_best = record["best_score"]
        new_best = max(old_best, body.score)
        # Only award points for improvement
        points_earned = round(max(0, new_best - old_best) * multiplier)
        supabase.table("drill_progress").update({
            "best_score": new_best,
            "completed": new_best == 100,
            "attempts": record["attempts"] + 1,
            "rank": body.difficulty,
        }).eq("id", record["id"]).execute()
    else:
        new_best = body.score
        points_earned = round(body.score * multiplier)
        supabase.table("drill_progress").insert({
            "user_id": str(user.id),
            "drill_id": body.drill_id,
            "key": body.key,
            "shape": body.shape,
            "scale": body.scale,
            "best_score": body.score,
            "completed": body.score == 100,
            "attempts": 1,
            "rank": body.difficulty,
        }).execute()

    # Add delta points to user profile
    if points_earned > 0:
        profile = (
            supabase.table("profiles")
            .select("total_points")
            .eq("id", str(user.id))
            .execute()
        )
        if profile.data:
            current = profile.data[0].get("total_points") or 0
            supabase.table("profiles").update({
                "total_points": current + points_earned
            }).eq("id", str(user.id)).execute()

    return {"points_earned": points_earned}
