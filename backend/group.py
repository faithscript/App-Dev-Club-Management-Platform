from fastapi import FastAPI, APIRouter, HTTPException
from models import ProfileOut
from database import db
from typing import List

group_router = APIRouter()

users_collection = db["users"]


# GET LIST OF USERS FOR SAME MENTOR
@group_router.get("/{mentor_name}", response_model=List[ProfileOut])
async def get_members(mentor_name:str):
    cursor = users_collection.find({"mentor_name": mentor_name})
    
    if not cursor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    
    members = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"]) # convert ObjectId to string for response
        members.append(doc)
    return members

# UPDATE POINT TOTALS FOR GROUP
# change the URL thing after bucketlist backend is complete
@group_router.put("/{mentor_name}/bucketlist/complete")
async def update_points(mentor_name:str, points_added:int):
    members = users_collection.find({"mentor_name": mentor_name})
    updated = 0

    # use async for loop since cursor returned by .find is async
    async for member in members:
        result = await users_collection.update_one(
            {"_id": member["_id"]},
            {"$inc": {"points": points_added}}
        )

        # increment updated var if number of docs modified > 0
        if result.modified_count > 0:
            updated += 1
    
    if updated == 0:
        raise HTTPException(status_code=404, detail="No members updated")
    return {"message": "Updated group points"}