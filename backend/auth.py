from fastapi import HTTPException  # type: ignore
from database import supabase


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
