from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_db, disconnect_db
from routes.users import router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (you can specify your frontend URL for production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include the users router with the '/api' prefix
app.include_router(router, prefix="/api")

# Event handler for starting up the application
@app.on_event("startup")
async def startup():
    # Connect to the database
    await connect_db()

# Event handler for shutting down the application
@app.on_event("shutdown")
async def shutdown():
    # Disconnect from the database
    await disconnect_db()

