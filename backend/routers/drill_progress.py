from fastapi import APIRouter, Header  # type: ignore
from pydantic import BaseModel  # type: ignore
from database import supabase
from auth import get_user_from_token

router = APIRouter()

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


# get drill progress
@router.get("/drill-progress")
def get_drill_progress(authorization: str | None = Header(None)):
    user = get_user_from_token(authorization)
    response = (
        supabase.table("drill_progress")
        .select("*")
        .eq("user_id", str(user.id))
        .execute()
    )
    return response.data


# save drill progress
@router.post("/drill-progress")
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

    # Check for drill completion (35 perfect combos) and notify once
    if body.score == 100:
        completed_count = (
            supabase.table("drill_progress")
            .select("id", count="exact")
            .eq("user_id", str(user.id))
            .eq("drill_id", body.drill_id)
            .eq("best_score", 100)
            .execute()
        )
        if completed_count.count == 35:
            notif_key = f"drill_complete:{body.drill_id}"
            already_notified = (
                supabase.table("notifications")
                .select("id")
                .eq("user_id", str(user.id))
                .eq("key", notif_key)
                .execute()
            )
            if not already_notified.data:
                drill_label = body.drill_id.replace("-", " ").title()
                supabase.table("notifications").insert({
                    "user_id": str(user.id),
                    "key": notif_key,
                    "title": f"{drill_label} — Complete!",
                    "body": f"You've mastered all 35 combinations. Keep pushing — try a harder difficulty!",
                }).execute()

    return {"points_earned": points_earned}
