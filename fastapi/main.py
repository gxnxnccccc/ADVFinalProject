from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.users import router
from database import connect_db, disconnect_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.on_event("startup")
async def startup():
    try:
        await connect_db()
    except Exception as e:
        print(f"Error during startup: {e}")

@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI application!"}


