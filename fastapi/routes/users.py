from fastapi import APIRouter,Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from database import (
    insert_user, get_user_by_username, get_admin_by_username_password,
    delete_user_data, get_all_users
)
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

# Dependency to get the current logged-in user from the JWT token
@manager.user_loader
async def get_user_from_token(username: str):
    user = await get_user_by_username(username)
    if user:
        return user
    return None

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
        print(user)
        # Admin login
        admin_data = await get_admin_by_username_password(user.username, user.password_hash)
        if admin_data:
            access_token = manager.create_access_token(data={"sub": admin_data["username"], "role": "Admin"})
            response = JSONResponse({
                "message": "Login successful as Admin!", 
                "user": dict(admin_data), 
                "role": "Admin",
                "access_token": access_token  # Include JWT in the response
            })
            cookie_name = f"access_token_{admin_data['username']}"
            response.set_cookie(key=cookie_name, value=access_token, httponly=True, samesite='None', secure=True)
            print("Set-Cookie for Admin:", response.headers.get("set-cookie"))  # Show cookie in console
            return response

        # User login (fetch user by username)
        user_data = await get_user_by_username(user.username)
        if user_data:
            # Verify the password using bcrypt
            if not bcrypt.checkpw(user.password_hash.encode(), user_data["password"].encode()):
                raise HTTPException(status_code=401, detail="Invalid credentials")

            # Create JWT token
            access_token = manager.create_access_token(data={"sub": user_data["username"], "role": "User"})
            response = JSONResponse({
                "message": "Login successful!", 
                "user": dict(user_data), 
                "role": "User",
                "access_token": access_token  # Include JWT in the response
            })

            cookie_name = f"access_token_{user_data['username']}"
            response.set_cookie(key=cookie_name, value=access_token, httponly=True, samesite='None', secure=True)
            print("Set-Cookie for User:", response.headers.get("set-cookie"))  # Show cookie in console

            return response

        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error during login: {str(e)}")

# Delete user account
@router.delete("/user/delete")
async def delete_user(username: str, current_user: dict = Depends(manager)):
    try:
        if current_user["username"] != username:
            raise HTTPException(status_code=403, detail="You are not authorized to delete this account")
        await delete_user_data(username)
        return {"message": "Account deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting account: {str(e)}")

# User logout route
@router.post("/user/logout")
async def logout_user(cookie_name: str):
    response = JSONResponse({"message": "Logged out successfully"})
    
    # ลบคุกกี้ที่มีชื่อจากคำขอ
    response.delete_cookie(cookie_name)

    return response

# Get all users route (admin-only access)
@router.get("/user/all-users")
async def get_all_user(current_user: dict = Depends(manager)):
    if current_user["role"] != "Admin":
        raise HTTPException(status_code=403, detail="You are not authorized to view all users")
    all_users = await get_all_users()
    return all_users

# Get all users route (admin-only access)
@router.get("/user/all-users-test")
async def get_all_user():
    all_users = await get_all_users()
    return all_users


@router.post("/check-cookie")
async def check_cookie(request: Request):
    # ตรวจสอบว่ามี cookie ที่ชื่อ "access_token" หรือไม่
    cookie_value = request.cookies.get("access_token")
    
    if cookie_value:
        return {"message": "Cookie is set", "cookie_value": cookie_value}
    else:
        raise HTTPException(status_code=404, detail="Cookie not found")

@router.get("/logged-in-users")
async def logged_in_users(request: Request):
    # Get all cookies from the request
    cookies = request.cookies
    logged_in_users = []

    for cookie_name in cookies:
        if cookie_name.startswith("access_token_"):
            username = cookie_name.split("_", 2)[-1]  # Extract username from cookie name
            logged_in_users.append(username)

    return {"logged_in_users": logged_in_users}