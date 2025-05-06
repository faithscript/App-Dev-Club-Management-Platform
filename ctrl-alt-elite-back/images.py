from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import io
from database import db
from typing import List

router = APIRouter(prefix="/images", tags=["images"])

# Models to help us keep track of image data
class ImageResponse(dict):
    image_id: str
    filename: str
    content_type: str

@router.post("/upload", status_code=201)
async def upload_image(file: UploadFile = File(...), user_id: str = None, is_profile_picture: bool = False):
    """
    Uploading an image file and linking it to a user if needed
    """
    print(f"Starting image upload for user_id: {user_id}, is_profile_picture: {is_profile_picture}")
    
    # Making sure we're only accepting image files
    content_type = file.content_type
    print(f"File content type: {content_type}")
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Reading the file contents
    contents = await file.read()
    print(f"File size: {len(contents)} bytes")
    
    # Creating some helpful metadata to keep track of the image
    metadata = {"filename": file.filename, "content_type": content_type}
    if user_id:
        metadata["user_id"] = user_id
        if is_profile_picture:
            metadata["is_profile_picture"] = True
    
    print(f"Metadata: {metadata}")
    
    try:
        # Saving the file info to MongoDB - Using the motor async client directly
        # First, create a file entry
        file_doc = {
            "filename": file.filename,
            "metadata": metadata,
            "length": len(contents)
        }
        print("Attempting to insert file document...")
        result = await db.fs.files.insert_one(file_doc)
        file_id = result.inserted_id
        print(f"File document inserted with ID: {file_id}")
        
        # Then store the file data
        chunk_doc = {
            "files_id": file_id,
            "n": 0,  # Chunk number
            "data": contents
        }
        print("Attempting to insert chunk document...")
        await db.fs.chunks.insert_one(chunk_doc)
        print("Chunk document inserted successfully")
        
        # If this is a profile picture, update the user's profile
        if user_id and is_profile_picture:
            print(f"Updating user profile with image ID: {file_id}")
            await db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"profile_picture": str(file_id)}}
            )
            print("User profile updated successfully")
        
        return {
            "image_id": str(file_id),
            "filename": file.filename,
            "content_type": content_type
        }
    except Exception as e:
        print(f"Error during image upload: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")

@router.post("/profile-picture/{user_id}")
async def set_profile_picture(user_id: str, file: UploadFile = File(...)):
    """
    Set a user's profile picture
    """
    # First upload the image
    image_response = await upload_image(file=file, user_id=user_id, is_profile_picture=True)
    return image_response

@router.get("/user/{user_id}")
async def get_user_images(user_id: str):
    """
    Finding all images that belong to a specific user
    """
    try:
        # Looking for all images linked to this user
        cursor = db.fs.files.find({"metadata.user_id": user_id})
        
        # Building a list of all the images we find
        images = []
        async for doc in cursor:
            images.append({
                "image_id": str(doc["_id"]),
                "filename": doc["filename"],
                "content_type": doc.get("metadata", {}).get("content_type", "image/jpeg")
            })
        
        return images
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing images: {str(e)}")

@router.get("/{image_id}")
async def get_image(image_id: str):
    """
    Grabbing an image by its ID so we can display it
    """
    print(f"Attempting to retrieve image with ID: {image_id}")
    try:
        # Convert the string ID to ObjectId
        obj_id = ObjectId(image_id)
        print(f"Valid ObjectId: {obj_id}")
        
        # Looking up the file info using Motor's async methods
        file_data = await db.fs.files.find_one({"_id": obj_id})
        print(f"File data found: {file_data is not None}")
        
        if not file_data:
            print(f"No file found with ID: {image_id}")
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Getting the actual image data
        chunk = await db.fs.chunks.find_one({"files_id": obj_id})
        print(f"Chunk data found: {chunk is not None}")
        
        if not chunk:
            print(f"No chunk found for file ID: {image_id}")
            raise HTTPException(status_code=404, detail="Image data not found")
        
        # Figuring out what type of image it is
        content_type = file_data.get("metadata", {}).get("content_type", "image/jpeg")
        print(f"Content type: {content_type}")
        
        # Sending the image back as a stream
        return StreamingResponse(
            io.BytesIO(chunk["data"]),
            media_type=content_type
        )
    except ValueError as e:
        print(f"Invalid ObjectId format: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid image ID format: {str(e)}")
    except Exception as e:
        print(f"Error retrieving image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving image: {str(e)}")

@router.delete("/{image_id}")
async def delete_image(image_id: str):
    """
    Getting rid of an image we don't need anymore
    """
    try:
        # Converting string ID to ObjectId
        obj_id = ObjectId(image_id)
        
        # Cleaning up both the file info and the actual data
        delete_file_result = await db.fs.files.delete_one({"_id": obj_id})
        delete_chunks_result = await db.fs.chunks.delete_many({"files_id": obj_id})
        
        if delete_file_result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Image not found")
            
        return {"message": "Image deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting image: {str(e)}") 