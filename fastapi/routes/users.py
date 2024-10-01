from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import insert_user  # Make sure the function is imported from database.py
from database import select_user

router = APIRouter()

class UserCreateRequest(BaseModel):
    username: str
    email: str
    password_hash: str

@router.post("/user/register")
async def create_user(user: UserCreateRequest):
    print("Received user:", user)
    try:
        new_user = await insert_user(user.username, user.password_hash, user.email)
        return new_user
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/users")
async def fetch_all_users(username: str = None, email: str = None):
    print("Select user:")
    try:
        users = await select_user(username=username, email=email)
        return users
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=str(e))
