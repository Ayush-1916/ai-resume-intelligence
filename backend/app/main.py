from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
print("your api is running fine")
# 👇 CORS MUST BE ADDED RIGHT AFTER app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "https://your-vercel-domain.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# THEN import routers
from app.routers import analyze

app.include_router(analyze.router)