from fastapi import FastAPI, APIRouter, Request, HTTPException, Depends, UploadFile, File, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field
from database import (
    insert_user, get_user_by_username, get_admin_by_username_password,
    delete_user_data, get_all_users, get_all_tables, get_current_database,
    update_user_data, insert_movies, get_all_movies, get_movie_by_movie_id,
    update_movie_data, delete_movie_data,
    insert_watchlist, get_watchlist_data, delete_watchlist_data
)
from fastapi_login import LoginManager
import bcrypt

from typing import Optional
from decimal import Decimal

from PIL import Image
import pytesseract

import asyncio
import psycopg2
import io

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

class LogoutRequest(BaseModel):
    cookie_name: str

class UserUpdateRequest(BaseModel):
    email: Optional[EmailStr] = None
    gender: Optional[str] = None
    phone_number: Optional[str] = None

class UserDeleteRequest(BaseModel):
    user_id: int

class MovieCreateRequest(BaseModel):
    title: str
    description: str
    duration: int
    language: str
    release_date: str
    genre: str
    rating: float = Field(..., gt=0, lt=10)

class MovieUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    language: Optional[str] = None
    release_date: Optional[str] = None
    genre: Optional[str] = None
    rating: Optional[float] = None
    # image: Optional[bytes] = None

# class MovieDeleteRequest(BaseModel):
#     movie_id: int

# Dependency to get the current logged-in user from the JWT token
@manager.user_loader
async def get_user_from_token(username: str):
    user = await get_user_by_username(username)
    # if user:
    #     return user
    return user if user else None
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
            response.set_cookie(key=cookie_name, value=access_token, httponly=True, samesite='Lax', secure=False,max_age=86400,path="/")
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
                "access_token": access_token,  # Include JWT in the response
                "user_id": user_data.user_id
            })

            cookie_name = f"access_token_{user_data['username']}"
            response.set_cookie(key=cookie_name, value=access_token, httponly=True, samesite='Lax', secure=False,max_age=86400,path="/")
            print("Set-Cookie for User:", response.headers.get("set-cookie"))  # Show cookie in console

            return response

        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error during login: {str(e)}")

# Delete user account
@router.delete("/user/delete")
async def delete_user(user_id: int, current_user: dict = Depends(manager)):
    try:
        # Check if the current user is authorized to delete the account
        if current_user["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="You are not authorized to delete this account")
        
        # Perform the delete operation
        await delete_user_data(user_id)
        
        return {"message": "Account deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting account: {str(e)}")

# User logout route
@router.post("/user/logout")
async def logout_user(request: LogoutRequest):
    response = JSONResponse({"message": "Logged out successfully"})
    response.delete_cookie(request.cookie_name)  # ใช้ request.cookie_name
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

@router.get("/user/{username}")
async def get_user_details(username: str):
    user_data = await get_user_by_username(username)
    return user_data

@router.get("/protected-route")
async def protected_route(current_user: dict = Depends(manager)):
    return {"message": "You have access to this route!"}

@router.get("/tables")
async def read_all_tables():
    tables = await get_all_tables()
    return {"tables": tables}

@router.get("current-database")
async def current_database():
    tables = await get_current_database()
    return {"tables": tables}

@router.put("/user/update")
async def update_user(
    user_id: int,
    # username: str,
    update_data: UserUpdateRequest
):
    try:
        # Update user information
        updated_user = await update_user_data(
            user_id=user_id,
            # username=username,
            email=update_data.email,
            gender=update_data.gender,
            phone_number=update_data.phone_number
        )
        if updated_user:
            return {"message": "User information updated successfully", "user": updated_user}
        else:
            raise HTTPException(status_code=404, detail="User not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")
    
# @router.delete("/user/delete")
# async def delete_user(
#     user_id: int,
#     user_delete_data: UserDeleteRequest
# ):
#     try:
#         # Update user information
#         updated_user = await update_user_data(
#             user_id=user_delete_data.user_id,
#             email=user_delete_data.email,
#             gender=user_delete_data.gender,
#             phone_number=user_delete_data.phone_number
#         )
#         if updated_user:
#             return {"message": "User deleted successfully", "user": user_delete_data}
#         else:
#             raise HTTPException(status_code=404, detail="User not found")

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")

@router.get("/movies")
async def fetch_movies():
    try:
        print(1)
        movies = await get_all_movies()
        print(movies)
        return {"message": "Movies fetched successfully", "movies": movies}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movies: {str(e)}")

async def image_to_text(image_file: UploadFile) -> str:
    try:
        image_data = await image_file.read()
        image = Image.open(io.BytesIO(image_data))
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        print(f"An error occurred: {e}")
        return ""
    
# @router.post("/movies/add")
# async def add_movie(movie: MovieCreateRequest):
#     try:
#         # Validate rating value
#         if movie.rating < 0 or movie.rating > 10:
#             raise HTTPException(status_code=400, detail="Rating must be between 0 and 10.")

#         # Validate image URL format
#         if not movie.image.endswith(('.jpg', '.jpeg', '.png', '.gif')):
#             raise HTTPException(status_code=400, detail="Invalid image URL. Must be a direct link to an image file (e.g., .jpg, .png).")

#         text_image = await image_to_text(movie.image)
#         print(text_image)

#         if not text_image:
#             raise HTTPException(status_code=400, detail="No text could be extracted from the image.")

#         # Call the insert_movies function to add the movie to the database
#         new_movie = await insert_movies(
#             title=movie.title,
#             description=movie.description,
#             duration=movie.duration,
#             language=movie.language,
#             release_date=movie.release_date,
#             genre=movie.genre,
#             rating=movie.rating,
#             image=psycopg2.binary(movie.image)
#         )

#         # Return the newly created movie data
#         return {"message": "Movie created successfully", "movie": new_movie}
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error creating movie: {str(e)}")
    
# @router.post("/movies/add")
# async def add_movie(
#     title: str,
#     description: str,
#     duration: int,
#     language: str,
#     release_date: str,
#     genre: str,
#     rating: Decimal = Field(..., gt=0, lt=10, max_digits=3, decimal_places=1),
#     image: UploadFile = File(...)
# ):
#     try:
#         # Validate rating value
#         if rating < 0 or rating > 10:
#             raise HTTPException(status_code=400, detail="Rating must be between 0 and 10.")

#         # Read the image file
#         image_data = await image.read()
#         text_image = await image_to_text(image)

#         if not text_image:
#             raise HTTPException(status_code=400, detail="No text could be extracted from the image.")

#         # Call the insert_movies function to add the movie to the database
#         new_movie = await insert_movies(
#             title=title,
#             description=description,
#             duration=duration,
#             language=language,
#             release_date=release_date,
#             genre=genre,
#             rating=rating,
#             image=image_data  # Store the binary data
#         )

#         # Return the newly created movie data
#         return {"message": "Movie created successfully", "movie": new_movie}
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error creating movie: {str(e)}")

# @router.post("/movies/add")
# async def add_movie(

#     movie: MovieCreateRequest,

#     title: str = Form(...),
#     description: str = Form(...),
#     duration: int = Form(...),
#     language: str = Form(...),
#     release_date: str = Form(...),
#     genre: str = Form(...),
#     rating: float = Form(...),
#     image: UploadFile = File(...)
# ):
#     print("Received data:", movie)
#     try:
#         # Validate rating value
#         if rating < 0 or rating > 10:
#             raise HTTPException(status_code=400, detail="Rating must be between 0 and 10.")

#         # Validate the image file type
#         if not image.filename.endswith(('.jpg', '.jpeg', '.png', '.gif')):
#             raise HTTPException(status_code=400, detail="Invalid image file. Must be an image file (e.g., .jpg, .png).")

#         # Read the image file content as binary
#         file_content = await image.read()

#         # If you have a function `image_to_text`, you need to pass the binary content, not the URL
#         text_image = await image_to_text(file_content)
#         print(text_image)

#         if not text_image:
#             raise HTTPException(status_code=400, detail="No text could be extracted from the image.")

#         # Call the insert_movies function to add the movie to the database
#         new_movie = await insert_movies(
#             title=title,
#             description=description,
#             duration=duration,
#             language=language,
#             release_date=release_date,
#             genre=genre,
#             rating=rating,
#             image=psycopg2.Binary(file_content)  # Store binary data in the database
#         )

#         # Return the newly created movie data
#         return {"message": "Movie created successfully", "movie": new_movie}
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error creating movie: {str(e)}")
    
# @router.post("/movies/add")
# async def add_movie(
#     title: str = Form(...),
#     description: str = Form(...),
#     duration: int = Form(...),
#     language: str = Form(...),
#     release_date: str = Form(...),
#     genre: str = Form(...),
#     rating: float = Form(...),
#     image: UploadFile = File(...)
# ):
#     try:
#         # Read the file content as binary
#         file_content = await image.read()
        
#         # Call the insert_movies function (ensure this function is working as expected)
#         new_movie = await insert_movies(
#             title=title,
#             description=description,
#             duration=duration,
#             language=language,
#             release_date=release_date,
#             genre=genre,
#             rating=rating,
#             image=file_content  # Storing as binary data
#         )
        
#         return {"message": "Movie created successfully", "movie": new_movie}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error creating movie: {str(e)}")

@router.post("/movies/add")
async def add_movie(
    title: str = Form(...),
    description: str = Form(...),
    duration: int = Form(...),
    language: str = Form(...),
    release_date: str = Form(...),  # This remains a string
    genre: str = Form(...),
    rating: float = Form(...),  # This remains a float
    image: UploadFile = File(...)
):
    try:
        # Read the file content as binary
        file_content = await image.read()
        
        # Call the insert_movies function
        new_movie = await insert_movies(
            title=title,
            description=description,
            duration=duration,
            language=language,
            release_date=release_date,  # Directly passing the string
            genre=genre,
            rating=rating,  # Passing the rating as a float
            image=file_content  # Storing as binary data
        )
        
        return {"message": "Movie created successfully", "movie": new_movie}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating movie: {str(e)}")
    
@router.put("/movie/update")
async def update_movie(
    movie_id: int, 
    update_data: MovieUpdateRequest,
    
):
    try:
        # Update user information
        updated_movie = await update_movie_data(
            movie_id=movie_id,
            title=update_data.title,
            description=update_data.description,
            duration=update_data.duration,
            language=update_data.language,
            release_date=update_data.release_date,
            genre=update_data.genre,
            rating=update_data.rating,
            # image=update_data.image
        )

        if updated_movie:
            return {"message": "Movie information updated successfully", "movie": updated_movie}
        else:
            raise HTTPException(status_code=404, detail="Movie not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting user: {str(e)}")
    
@router.delete("/movie/delete")
async def delete_movie(movie_id: int):
    try:
        # Delete user information
        await delete_movie_data(movie_id=movie_id)

        return {"message": "Movie Delete Successfully!", "movie_id": movie_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting movie: {str(e)}")
    
@router.get("/watchlist")
async def fetch_watchlist(
    user_id: int,
):
    try:
        print(1)
        watchlist = await get_watchlist_data(
            user_id=user_id
        )

        return {"message": "Watchlist fetched successfully", "watchlist": watchlist}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching watchlists: {str(e)}")
    
@router.post("/watchlist/add")
async def add_watchlist(
    user_id: int,
    movie_id: int
):
    try:
        # Call the insert_watchlist function
        new_watchlist = await insert_watchlist(
            user_id=user_id,
            movie_id=movie_id
        )

        return {"message": "Movie added to watchlist successfully", "watchlist": new_watchlist}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user_id or movie_id. They must be integers.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating watchlist movie: {str(e)}")

# @router.delete("/watchlist/delete")
# async def delete_watchlist(
#     user_id: int,
#     movie_id: int
# ):
#     try:
#         # Delete the watchlist entry by user_id and movie_id
#         result = await delete_watchlist_data(user_id=user_id, movie_id=movie_id)

#         if result:
#             return {"message": "Movie deleted successfully!", "watchlist_id": result}
#         else:
#             raise HTTPException(status_code=404, detail="Watchlist entry not found.") # เข้า function นี้ แต่ลบได้จิง
    
#     except ValueError:
#         raise HTTPException(status_code=400, detail="Invalid user_id or movie_id. They must be integers.")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error deleting movie: {str(e)}")

@router.delete("/watchlist/delete")
async def delete_watchlist(
    user_id: int,
    movie_id: int
):
    try:
        # Delete the watchlist entry by user_id and movie_id
        watchlist_id = await delete_watchlist_data(user_id=user_id, movie_id=movie_id)

        if watchlist_id:
            return {"message": "Movie deleted successfully!", "watchlist_id": watchlist_id}
        else:
            raise HTTPException(status_code=404, detail="Watchlist entry not found.")
    
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user_id or movie_id. They must be integers.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting movie: {str(e)}")