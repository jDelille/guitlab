from fastapi import FastAPI  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from routers import drills, drill_progress, leaderboard, users

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://guitlab.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routers
app.include_router(drills.router)
app.include_router(drill_progress.router)
app.include_router(leaderboard.router)
app.include_router(users.router)


@app.get("/")
def read_root():
    return {"message": "Hello from the backend"}
