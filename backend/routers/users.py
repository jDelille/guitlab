from fastapi import APIRouter, Header  # type: ignore
from pydantic import BaseModel  # type: ignore
from database import supabase
from auth import get_user_from_token

router = APIRouter()


class UpdateProfileBody(BaseModel):
    username: str


@router.get("/users/me")
def get_profile(authorization: str | None = Header(None)):
    user = get_user_from_token(authorization)
    response = (
        supabase.table("profiles")
        .select("*")
        .eq("id", str(user.id))
        .execute()
    )
    return response.data[0] if response.data else {}


@router.patch("/users/me")
def update_profile(body: UpdateProfileBody, authorization: str | None = Header(None)):
    user = get_user_from_token(authorization)
    response = (
        supabase.table("profiles")
        .update({"username": body.username})
        .eq("id", str(user.id))
        .execute()
    )
    return response.data[0] if response.data else {}
