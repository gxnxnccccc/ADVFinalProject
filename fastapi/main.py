from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routes.users import router  # Ensure this imports correctly
from database import connect_db, disconnect_db

app = FastAPI()

# Add CORS middleware if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for your production environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the user router with a specified prefix
app.include_router(router, prefix="/api")

# Event handler for application startup
@app.on_event("startup")
async def startup():
    await connect_db()

# Event handler for application shutdown
@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()

# Example route to test the application
@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI application!"}