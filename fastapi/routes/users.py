from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import insert_user, get_user_by_username_password, get_admin_by_username_password

router = APIRouter()

class UserCreateRequest(BaseModel):
    username: str
    email: str
    password_hash: str
    gender: str
    age: int

class UserLoginRequest(BaseModel):
    username: str
    password_hash: str

@router.post("/user/register")
async def create_user(user: UserCreateRequest):
    try:
        new_user = await insert_user(user.username, user.password_hash, user.email, user.gender, user.age)
        return new_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/user/login")
async def login_user(user: UserLoginRequest):
    try:
        # First, attempt to login as an Admin
        admin_data = await get_admin_by_username_password(user.username, user.password_hash)
        if admin_data:
            return {"message": "Login successful as Admin!", "user": admin_data, "role": "Admin"}

        # If not an Admin, attempt to login as a regular user
        user_data = await get_user_by_username_password(user.username, user.password_hash)
        if user_data:
            return {"message": "Login successful!", "user": user_data, "role": "User"}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Server error during login")
