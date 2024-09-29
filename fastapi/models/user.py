# models/user.py

from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

# Pydantic models
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str  # or password_hash if you're hashing the password before saving

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        orm_mode = True  # This allows the Pydantic model to work with SQLAlchemy models

# SQLAlchemy model
Base = declarative_base()

class UserDB(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)  # Store the hashed password here