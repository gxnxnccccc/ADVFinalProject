from databases import Database
import asyncpg
import asyncio
from typing import Optional

POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = "password"
POSTGRES_DB = "finalproject"
POSTGRES_HOST = "127.0.0.1"
POSTGRES_PORT = "5432"

# DATABASE_URL = f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}'
DATABASE_URL = "postgresql://postgres:password@db:5432/finalproject"

database = Database(DATABASE_URL)
async def insert_user(username: str, password_hash: str, email: str, gender: str, age: int, phone_number: str = None):
    query = """
    INSERT INTO users (username, password, email, gender, age, phone_number)
    VALUES (:username, :password, :email, :gender, :age, :phone_number)
    RETURNING user_id, username, email, gender, age, phone_number
    """
    values = {
        "username": username,
        "password": password_hash, 
        "email": email, 
        "gender": gender, 
        "age": age, 
        "phone_number": phone_number,
        }
    print(query, values)
    return await database.fetch_one(query=query, values=values)

async def get_all_users():
    query = "SELECT * FROM users"
    user_data = await database.fetch_all(query=query)
    return user_data

async def get_user_by_username(username: str):
    query = "SELECT user_id, username, email, password, gender, age, phone_number FROM users WHERE username = :username"
    values = {"username": username}
    return await database.fetch_one(query=query, values=values)

async def get_admin_by_username_password(username: str, password_hash: str):
    query = """
    SELECT admin_id, username, email FROM "Admin"
    WHERE username = :username AND password = :password
    """
    values = {"username": username, "password": password_hash}
    return await database.fetch_one(query=query, values=values)

async def delete_user_data(username: str):
    await database.execute("DELETE FROM favorites WHERE username = :username", {"username": username})
    await database.execute("DELETE FROM users WHERE username = :username", {"username": username})

async def update_user_data(username: str, email: Optional[str], gender: Optional[str], phone_number: Optional[str]):
    values = {}
    if email:
        values["email"] = email
    if gender:
        values["gender"] = gender
    if phone_number:
        values["phone_number"] = phone_number

    # Build the SET part of the query dynamically based on the fields provided
    set_clause = ", ".join([f"{key} = :{key}" for key in values])

    query = f"""
    UPDATE users
    SET {set_clause}
    WHERE username = :username
    RETURNING username, email, gender, phone_number
    """
    values["username"] = username

    return await database.fetch_one(query=query, values=values)


async def get_all_tables():
    print(1)
    try:
        query = """
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        """
        tables = await database.fetch_all(query=query)
        return {"tables": [table["table_name"] for table in tables]}
    except Exception as e:
        print(f"Error fetching tables: {e}")
        return {"error": str(e)}
    
async def get_current_database():
    query = "SELECT current_database()"
    current_db = await database.fetch_one(query=query)
    print(DATABASE_URL)
    return {"current_database": current_db[0]}


async def connect_db():
    while True:
        try:
            await database.connect()
            break
        except (asyncpg.exceptions.PostgresConnectionError, ConnectionRefusedError):
            print("Database is not ready yet. Retrying in 1 second...")
            await asyncio.sleep(1)

async def disconnect_db():
    await database.disconnect()