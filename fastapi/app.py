from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database import connect_db, disconnect_db
from routes.users import router

app = FastAPI()

# Include the users router with the '/api' prefix
app.include_router(router, prefix="/api")

@app.on_event("startup")
async def startup():
    await connect_db()

@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()