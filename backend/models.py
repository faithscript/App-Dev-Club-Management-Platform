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
    profile_picture: Optional[str] = None  # Store the image ID

class UpdateProfile(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None
    #accountType: Optional[str] = None
    mentor_name: Optional[str] = None
    fun_facts: Optional[str] = None
    profile_picture: Optional[str] = None  # Allow updating profile picture

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