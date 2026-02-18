from fastapi import FastAPI
from app.routers import analyze

app = FastAPI(title="AI Resume Intelligence API")

app.include_router(analyze.router)