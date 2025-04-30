from fastapi import FastAPI, APIRouter, HTTPException, Body
from database import db
from models import Profile, ProfileOut, UpdateProfile
from pymongo import ReturnDocument
from typing import List

profile_router = APIRouter()
users_collection = db["users"]

@profile_router.get("/role/{account_type}", response_model=List[ProfileOut])
async def get_by_role(account_type: str):
    cursor = users_collection.find({"accountType": account_type})
    
    if not cursor:
        raise HTTPException(status_code=404, detail=f"No users found for role {account_type}")
    
    users = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        users.append(doc)
    return users

# GET PROFILE INFO OF USER
@profile_router.get("", response_model=ProfileOut)
async def get_profile(email: str):
    print(f"Received email: {email}")  # debugging (remember to remove later)

    try:
        user = await users_collection.find_one({"email": email.strip()}) # strip whitespace from email
        print("Finished search")
    except Exception as e:
        print(f"Exception during database query: {e}")
        raise HTTPException(status_code=500, detail="Database query failed >:0")
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["_id"] = str(user["_id"]) # convert ObjectID to str
    
    # If user has a profile picture, include the full URL
    if user.get("profile_picture"):
        user["profile_picture"] = f"/images/{user['profile_picture']}"
    
    return user

# UPDATE USER INFORMATION
@profile_router.put("", response_model=Profile)
async def update_profile(email:str, update:UpdateProfile = Body(...)):
    # convert UpdateProfile model 'update' into dict
    data = update.model_dump()
    update_data = {}

    # loop through each key value pair from model's dict
    for key, value in data.items():
        # only add field to 'update_data' dict if it's not empty
        if value is not None:
            update_data[key] = value

    # if there's at least one field to update:
    if len(update_data) > 0:

        update_result = await users_collection.find_one_and_update(
           {"email": email.strip()},    # get user with email
           {"$set": update_data},    # set fields in the 'update_data' dict (nonempty fields)
           return_document=ReturnDocument.AFTER     # makes mongo return updated version of document
        )

        # if user was found and updated, return string version of id
        if update_result is not None:
            update_result["_id"] = str(update_result["_id"])
            return update_result
        else:
            raise HTTPException(status_code=404, detail=f"User not found")
    
    raise HTTPException(status_code=400, detail="No fields to update")