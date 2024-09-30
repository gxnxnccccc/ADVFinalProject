from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import insert_user  # Make sure the function is imported from database.py

router = APIRouter()

class UserCreateRequest(BaseModel):
    username: str
    email: str
    password_hash: str

@router.post("/create")
async def create_user(user: UserCreateRequest):
    try:
        new_user = await insert_user(user.username, user.password_hash, user.email)
        return new_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

