from fastapi import FastAPI, APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import Optional
from passlib.context import CryptContext
from models import UserSignup, UserLogin
from database import db

auth_router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Helper functions
def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Routes
@auth_router.post("/signup")
async def signup(user: UserSignup):
    # Checking if user already exists
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user with hashed password
    user_dict = user.model_dump()
    user_dict["password"] = get_password_hash(user_dict["password"])
    result = await db.users.insert_one(user_dict)
    
    # Return the same user information as login
    return {"message": "User created successfully", "user": {
        "id": str(result.inserted_id),
        "accountType": user.accountType,
        "fullName": user.fullName,
        "email": user.email,
        "mentor_name": user.mentor_name,
    }}

@auth_router.post("/login")
async def login(user: UserLogin):
    # Finding user
    db_user = await db.users.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Verify password
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    return {"message": "Login successful", "user": {
        "id": str(db_user["_id"]),
        "accountType": db_user["accountType"],
        "fullName": db_user["fullName"],
        "email": db_user["email"],
        "mentor_name": db_user["mentor_name"]
    }}