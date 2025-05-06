import asyncio
from database import db
from motor.motor_asyncio import AsyncIOMotorClient

async def remove_default_tasks():
    """Remove the default 'Get boba' task from all bucket lists"""
    
    print("Starting removal of default tasks...")
    
    # Get all bucket lists
    bucket_lists = await db.bucket_lists.find().to_list(length=None)
    print(f"Found {len(bucket_lists)} bucket lists")
    
    for bucket in bucket_lists:
        mentor_name = bucket.get("mentor_name", "Unknown")
        tasks = bucket.get("tasks", [])
        
        # Count tasks before filtering
        original_count = len(tasks)
        
        # Filter out tasks with description "Get boba" or that use task_id instead of id
        new_tasks = [task for task in tasks if 
                    ("description" not in task or task["description"] != "Get boba") and
                    ("task_id" not in task)]
        
        # If we removed any tasks, update the bucket list
        if len(new_tasks) != original_count:
            print(f"Removing default task from {mentor_name}'s bucket list")
            result = await db.bucket_lists.update_one(
                {"_id": bucket["_id"]},
                {"$set": {"tasks": new_tasks}}
            )
            print(f"Updated: {result.modified_count}")
        else:
            print(f"No default tasks found for {mentor_name}")
    
    print("Task removal complete!")

if __name__ == "__main__":
    # Run the async function
    asyncio.run(remove_default_tasks()) 