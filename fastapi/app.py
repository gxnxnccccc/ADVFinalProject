from fastapi import FastAPI
from database import connect_db, disconnect_db
from routes.users import router

# Initialize FastAPI app
app = FastAPI()

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
