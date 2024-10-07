from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.users import router
from database import connect_db, disconnect_db, database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend's origin
    # allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.on_event("startup")
async def startup():
    try:
        await connect_db()
        await check_table_exists("Admin")

    except Exception as e:
        print(f"Error during startup: {e}")

@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()


@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI application!"}


async def check_table_exists(table_name: str):
    query = f"SELECT to_regclass('{table_name}');"
    result = await database.fetch_one(query)
    if result[0] is None:
        raise HTTPException(status_code=500, detail=f"Table '{table_name}' does not exist")
    print(f"Table '{table_name}' exists in the database.")