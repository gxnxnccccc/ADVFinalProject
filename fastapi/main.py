from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import users  # Importing the users router

app = FastAPI()

# Add CORS middleware if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for your production environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the user routes
app.include_router(users.router)