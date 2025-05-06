from fastapi import FastAPI, APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import uuid4

# Authentication Models
class UserSignup(BaseModel):
    accountType: str
    fullName: str
    email: str
    password: str
    mentor_name: Optional[str] = None #Discuss with group
    fun_facts: Optional[str] = ""   #Discuss with group
    points: int = 0 #Discuss with group
    profile_pic: Optional[str] = None  # Store the image URL

class UserLogin(BaseModel):
    email: str
    password: str

# Profile Models
class Profile(BaseModel):
    fullName: str
    email: str
    accountType: str
    mentor_name: Optional[str] = None
    fun_facts: str
    points: int
    profile_pic: Optional[str] = None  # Store the image URL

class UpdateProfile(BaseModel):
    fullName: Optional[str] = None
    mentor_name: Optional[str] = None
    fun_facts: Optional[str] = None

class ProfilePicUpdate(BaseModel):
    profile_pic: str  # Base64-encoded image

class ProfileOut(Profile):
    id: str = Field(alias="_id")

# Bucket List Models
class Task(BaseModel):
    id: str = None
    description: str
    completed: bool = False

    def model_post_init(self, __context):
        if self.id is None:
            self.id = str(uuid4())

class BucketList(BaseModel):
    mentor_name: str
    tasks: List[Task]