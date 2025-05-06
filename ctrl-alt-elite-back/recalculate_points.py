import asyncio
from database import db
from motor.motor_asyncio import AsyncIOMotorClient

async def recalculate_all_points():
    """Recalculate points for all users based on task completion status."""
    
    print("Starting points recalculation...")
    
    # Reset all users' points to zero first
    reset_result = await db.users.update_many(
        {},  # All users
        {"$set": {"points": 0}}
    )
    print(f"Reset points for {reset_result.modified_count} users")
    
    # Get all bucket lists
    bucket_lists = await db.bucket_lists.find().to_list(length=None)
    print(f"Found {len(bucket_lists)} bucket lists")
    
    for bucket in bucket_lists:
        mentor_name = bucket.get("mentor_name", "Unknown")
        tasks = bucket.get("tasks", [])
        
        # Count completed tasks
        completed_tasks = 0
        for task in tasks:
            if task.get("completed", False):
                completed_tasks += 1
        
        if completed_tasks > 0:
            print(f"Found {completed_tasks} completed tasks for {mentor_name}")
            points_to_add = completed_tasks * 10
            
            # Update mentor's points
            mentor_result = await db.users.update_one(
                {"fullName": mentor_name},
                {"$inc": {"points": points_to_add}}
            )
            
            if mentor_result.modified_count > 0:
                print(f"Updated mentor {mentor_name} with {points_to_add} points")
            
            # Update points for all mentees in the group
            mentee_result = await db.users.update_many(
                {"mentor_name": mentor_name},
                {"$inc": {"points": points_to_add}}
            )
            
            if mentee_result.modified_count > 0:
                print(f"Updated {mentee_result.modified_count} mentees of {mentor_name} with {points_to_add} points")
    
    # Print final results
    user_count = await db.users.count_documents({})
    users_with_points = await db.users.count_documents({"points": {"$gt": 0}})
    
    print(f"\nRecalculation complete!")
    print(f"Total users: {user_count}")
    print(f"Users with points: {users_with_points}")
    
    # Show top 5 users by points
    top_users = await db.users.find().sort("points", -1).limit(5).to_list(length=5)
    print("\nTop 5 users by points:")
    for i, user in enumerate(top_users, 1):
        print(f"{i}. {user.get('fullName', 'Unknown')}: {user.get('points', 0)} points")

if __name__ == "__main__":
    # Run the async function
    asyncio.run(recalculate_all_points()) 