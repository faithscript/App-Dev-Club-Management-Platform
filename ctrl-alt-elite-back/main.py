from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from auth import auth_router
from user_profile import profile_router
from group import group_router
from bucket_list import bucketlist_router
from images import router as images_router
from database import db, check_storage_metrics

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # frontend ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/metrics/storage")
async def get_storage_metrics():
    metrics = await check_storage_metrics()
    if metrics is None:
        raise HTTPException(status_code=500, detail="Failed to fetch storage metrics")
    return metrics

# routers for authentication (login/sign up), profile updates/viewing
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(profile_router, prefix="/profile", tags=["profile"])
app.include_router(group_router, prefix="/group", tags=["group"])
app.include_router(bucketlist_router, prefix="/bucketlist", tags=["bucketlist"])
app.include_router(images_router) # Image handling routes