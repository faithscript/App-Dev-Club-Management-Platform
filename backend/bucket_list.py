from fastapi import APIRouter, HTTPException, Body
from uuid import uuid4
from models import Task, BucketList
from typing import List
from database import db

bucketlist_router = APIRouter()

# Collections
users_collection = db["users"]
bucketlist_collection = db["bucket_lists"]

# Helper function to get user and their role
async def get_user_role(email: str):
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.get("accountType", "student")

# Get bucket list for mentor group
@bucketlist_router.get("/{mentor_name}/bucket_lists", response_model=BucketList)
async def get_bucketlist(mentor_name: str):
    bucket = await bucketlist_collection.find_one({"mentor_name": mentor_name})
    if not bucket:
        raise HTTPException(status_code=404, detail="Bucket list not found")
    return bucket

# Get all tasks in a bucket list
@bucketlist_router.get("/bucket_lists/{mentor_name}", response_model=List[Task])
async def get_bucketlist_tasks(mentor_name: str):
    bucketlist = await bucketlist_collection.find_one({"mentor_name": mentor_name})
    if not bucketlist:
        return []
    return bucketlist.get("tasks", [])

# Admin can view all bucketlists
@bucketlist_router.get("/bucket_lists", response_model=List[dict])
async def get_all_bucketlists():
    bucketlists = []
    async for doc in bucketlist_collection.find():
        doc["_id"] = str(doc["_id"])
        bucketlists.append(doc)
    return bucketlists

# Add tasks (Admins & Mentors only)
@bucketlist_router.post("/{mentor_name}/bucket_lists")
async def add_task(mentor_name: str, task: Task, user_email: str):
    role = await get_user_role(user_email)

    task.id = str(uuid4())  # Ensure task has a UUID

    task_data = {
        "id": task.id,
        "description": task.description,
        "completed": False
    }

    result = await bucketlist_collection.update_one(
        {"mentor_name": mentor_name},
        {"$push": {"tasks": task_data}},
        upsert=True
    )
    return {"message": "Task added"}

# Mark task complete and add points (Mentors & Admins only)
@bucketlist_router.put("/{mentor_name}/bucket_lists/complete/{task_id}")
async def complete_task(mentor_name: str, task_id: str, user_email: str):
    role = await get_user_role(user_email)
    if role not in ["Mentor", "Admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to complete tasks")

    bucket = await bucketlist_collection.find_one({"mentor_name": mentor_name})
    if not bucket:
        raise HTTPException(status_code=404, detail="Bucket list not found")

    tasks = bucket["tasks"]
    found = False
    for task in tasks:
        if task["_id"] == task_id:
            if task["completed"]:
                return {"message": "Task already completed"}
            task["completed"] = True
            found = True
            break

    if not found:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update the task list
    await bucketlist_collection.update_one(
        {"mentor_name": mentor_name},
        {"$set": {"tasks": tasks}}
    )

    # Add 10 points to every member in the group
    await users_collection.update_many(
        {"mentor_name": mentor_name},
        {"$inc": {"points": 10}}
    )

    return {"message": "Task marked complete and points awarded"}

# Toggle task completion and update points (Mentors & Admins only)
@bucketlist_router.put("/{mentor_name}/bucket_lists/toggle/{task_id}")
async def toggle_task_completion(
    mentor_name: str,
    task_id: str,
    user_email: str,
    completed: bool = Body(..., embed=True)
):
    role = await get_user_role(user_email)
    if role not in ["mentor", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to toggle tasks")

    bucket = await bucketlist_collection.find_one({"mentor_name": mentor_name})
    if not bucket:
        raise HTTPException(status_code=404, detail="Bucket list not found")

    tasks = bucket["tasks"]
    found = False
    for task in tasks:
        if task["id"] == task_id:
            if task["completed"] == completed:
                return {"message": f"Task already {'completed' if completed else 'incomplete'}"}
            task["completed"] = completed
            found = True
            break

    if not found:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update the task list
    await bucketlist_collection.update_one(
        {"mentor_name": mentor_name},
        {"$set": {"tasks": tasks}}
    )

    # Update points for every member in the group
    points_delta = 10 if completed else -10
    await users_collection.update_many(
        {"mentor_name": mentor_name},
        {"$inc": {"points": points_delta}}
    )

    return {"message": f"Task marked {'complete' if completed else 'incomplete'} and points {'awarded' if completed else 'removed'}"}

# Delete task (Mentors & Admins only)
@bucketlist_router.delete("/{mentor_name}/bucket_lists/task/{task_id}")
async def delete_task(mentor_name: str, task_id: str, user_email: str):
    role = await get_user_role(user_email)
    if role not in ["Mentor", "Admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete tasks")
    
    bucket = await bucketlist_collection.find_one({"mentor_name": mentor_name})
    if not bucket:
        raise HTTPException(status_code=404, detail="Bucket list not found")
    
    # Filter out the task to be deleted
    tasks = bucket.get("tasks", [])
    original_count = len(tasks)
    tasks = [task for task in tasks if task["id"] != task_id]
    
    # Check if any task was removed
    if len(tasks) == original_count:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update the task list
    await bucketlist_collection.update_one(
        {"mentor_name": mentor_name},
        {"$set": {"tasks": tasks}}
    )
    
    return {"message": f"Task deleted successfully"}
