from fastapi import FastAPI, Body, APIRouter, HTTPException
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Dict, List
from bson import ObjectId
import os
from dotenv import load_dotenv
from models import Profile, ProfileOut, UpdateProfile
from pymongo import ReturnDocument

# Load environment variables from .env file
load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI")

# MongoDB connection
client = AsyncIOMotorClient(MONGODB_URI, tlsAllowInvalidCertificates=True)
db = client["bootcamp"]

async def check_storage_metrics():
    try:
        # Get database stats
        db_stats = await db.command("dbStats")
        
        # Check if GridFS collections exist
        collections = await db.list_collection_names()
        has_gridfs = "fs.files" in collections and "fs.chunks" in collections
        
        # Get collection stats for fs collections if they exist
        fs_files_stats = await db.fs.files.stats() if "fs.files" in collections else {"count": 0, "size": 0}
        fs_chunks_stats = await db.fs.chunks.stats() if "fs.chunks" in collections else {"count": 0, "size": 0}
        
        return {
            "database_size": db_stats["dataSize"],
            "storage_size": db_stats["storageSize"],
            "indexes": db_stats["indexes"],
            "has_gridfs": has_gridfs,
            "collections": collections,
            "fs_files": {
                "count": fs_files_stats["count"],
                "size": fs_files_stats["size"]
            },
            "fs_chunks": {
                "count": fs_chunks_stats["count"],
                "size": fs_chunks_stats["size"]
            }
        }
    except Exception as e:
        print(f"Error checking storage metrics: {e}")
        return None