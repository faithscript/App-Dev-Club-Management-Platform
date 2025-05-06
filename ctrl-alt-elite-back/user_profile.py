from fastapi import File, UploadFile, APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from database import db
from models import Profile, ProfileOut, UpdateProfile, ProfilePicUpdate
from pymongo import ReturnDocument
from typing import List, Optional
from cloudinary_config import cloudinary
import cloudinary.uploader

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
    return user

# UPDATE USER INFORMATION
@profile_router.put("", response_model=ProfileOut)
async def update_profile(
    email: str, 
    update: Optional[UpdateProfile] = None,
):
    update_data = {}
    
    # Process regular profile fields if update model is provided
    if update:
        # convert UpdateProfile model 'update' into dict
        data = update.model_dump()

        # loop through each key value pair from model's dict
        for key, value in data.items():
            # only add field to 'update_data' dict if it's not empty
            if value is not None:
                update_data[key] = value
    
    # If there's at least one field to update:
    if len(update_data) > 0:
        update_result = await users_collection.find_one_and_update(
           {"email": email.strip()},    # get user with email
           {"$set": update_data},       # set fields in the 'update_data' dict
           return_document=ReturnDocument.AFTER     # makes mongo return updated version of document
        )

        # if user was found and updated, return string version of id
        if update_result is not None:
            update_result["_id"] = str(update_result["_id"])
            return update_result
        else:
            raise HTTPException(status_code=404, detail=f"User not found")
    
    raise HTTPException(status_code=400, detail="No fields to update")

@profile_router.put("/image", response_model=ProfileOut)
async def upload_image(data: ProfilePicUpdate, email: str = Query(...)):
    try:
        profile_pic_base64 = data.profile_pic
        image_url = None
        
        # Try using Cloudinary if configured properly
        try:
            if (cloudinary.config().cloud_name and 
                cloudinary.config().api_key and 
                cloudinary.config().api_secret and
                cloudinary.config().cloud_name != "your_cloud_name"):
                
                upload_result = cloudinary.uploader.upload(
                    profile_pic_base64,
                    resource_type="auto"
                )
                image_url = upload_result.get("secure_url")
            else:
                # Fallback to local storage if Cloudinary isn't configured
                print("Cloudinary not configured. Using local storage.")
                
                # Convert base64 to binary data
                import base64
                import io
                from bson import ObjectId
                
                # Strip the base64 prefix if it exists
                if "," in profile_pic_base64:
                    _, data_string = profile_pic_base64.split(",", 1)
                else:
                    data_string = profile_pic_base64
                
                # Convert to binary
                file_data = base64.b64decode(data_string)
                
                # Get content type (defaults to png if not detectable)
                content_type = "image/png"
                if profile_pic_base64.startswith("data:"):
                    content_type = profile_pic_base64.split(";")[0].replace("data:", "")
                
                # Metadata
                metadata = {
                    "filename": f"{email}_profile.{content_type.split('/')[1]}",
                    "content_type": content_type,
                    "user_id": email,
                    "is_profile_picture": True
                }
                
                # Store in GridFS
                # First, create a file entry
                file_doc = {
                    "filename": metadata["filename"],
                    "metadata": metadata,
                    "length": len(file_data)
                }
                
                # Insert file info
                result = await db.fs.files.insert_one(file_doc)
                file_id = result.inserted_id
                
                # Insert file data
                chunk_doc = {
                    "files_id": file_id,
                    "n": 0,  # Chunk number
                    "data": file_data
                }
                await db.fs.chunks.insert_one(chunk_doc)
                
                # Set URL to the images endpoint
                image_url = f"/images/{str(file_id)}"
        except Exception as e:
            print(f"Image storage error: {e}")
            # Use a fallback URL if all else fails
            image_url = "/profile/local-image-fallback"
        
        # Update user profile with the image URL
        update_data = {"profile_pic": image_url}

        update_result = await users_collection.find_one_and_update(
            {"email": email.strip()},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER
        )

        if update_result is not None:
            update_result["_id"] = str(update_result["_id"])
            return update_result

        raise HTTPException(status_code=404, detail="User not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")
