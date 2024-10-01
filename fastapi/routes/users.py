from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import insert_user, select_user, get_user_by_email_password  # Updated to import get_user_by_email_password

router = APIRouter()

class UserCreateRequest(BaseModel):
    username: str
    email: str
    password_hash: str

class UserLoginRequest(BaseModel):
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

# New route for login
@router.post("/user/login")
async def login_user(user: UserLoginRequest):
    print("Login attempt for:", user.email)
    try:
        user_data = await get_user_by_email_password(user.email, user.password_hash)
        if user_data:
            return {"message": "Login successful!", "user": user_data}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        print("Error during login:", e)
        raise HTTPException(status_code=500, detail="Server error during login")
