from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from database import insert_user, get_user_by_username, get_admin_by_username_password, delete_user_data
from fastapi_login import LoginManager
import bcrypt

SECRET = "your-secret-key"  # Use a secure key here
manager = LoginManager(SECRET, token_url='/api/user/login')

router = APIRouter()

class UserCreateRequest(BaseModel):
    username: str
    email: str
    password_hash: str
    gender: str
    age: int
    phone_number: str = None

class UserLoginRequest(BaseModel):
    username: str
    password_hash: str
    remember_me: bool = False

# User registration route
@router.post("/user/register")
async def create_user(user: UserCreateRequest):
    try:
        # Hash the password before storing it
        hashed_password = bcrypt.hashpw(user.password_hash.encode(), bcrypt.gensalt()).decode()

        new_user = await insert_user(user.username, hashed_password, user.email, user.gender, user.age, user.phone_number)
        return new_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

# User login route
@router.post("/user/login")
async def login_user(user: UserLoginRequest):
    try:
        # Admin login
        admin_data = await get_admin_by_username_password(user.username, user.password_hash)
        if admin_data:
            access_token = manager.create_access_token(data={"sub": admin_data["username"]})
            response = JSONResponse({"message": "Login successful as Admin!", "user": admin_data, "role": "Admin"})
            if user.remember_me:
                manager.set_cookie(response, access_token)
            return response

        # User login (fetch user by username)
        user_data = await get_user_by_username(user.username)  # Fetch user only by username
        if user_data:
            print(f"User Data Retrieved: {user_data}")
            print(f"Password Entered: {user.password_hash}")
            print(f"Stored Hashed Password: {user_data['password']}")

            # Check the password using bcrypt and compare with the stored hash
            if not bcrypt.checkpw(user.password_hash.encode(), user_data["password"].encode()):
                raise HTTPException(status_code=401, detail="Invalid credentials")

            # Create JWT token
            access_token = manager.create_access_token(data={"sub": user_data["username"]})
            response = JSONResponse({"message": "Login successful!", "user": user_data, "role": "User"})
            if user.remember_me:
                manager.set_cookie(response, access_token)
            return response
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error during login: {str(e)}")

# Delete user account
@router.delete("/user/delete")
async def delete_user(username: str):
    try:
        await delete_user_data(username)
        return {"message": "Account deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting account: {str(e)}")

# User logout route
@router.post("/user/logout")
async def logout_user():
    response = JSONResponse({"message": "Logged out successfully"})
    manager.delete_cookie(response)
    return response