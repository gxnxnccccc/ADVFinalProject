from databases import Database
import psycopg2

POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = "password"
POSTGRES_DB = "finalproject"
POSTGRES_HOST = "127.0.0.1"
POSTGRES_PORT = "5432"

DATABASE_URL = f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}'
database = Database(DATABASE_URL)

async def insert_user(username: str, password_hash: str, email: str):
    query = """
    INSERT INTO users (username, password, email)
    VALUES (:username, :password, :email)
    RETURNING user_id, username, email 
    """
    values = {"username": username, "password": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)

async def select_user(username: str = None, email: str = None):
    if username is None and email is None:
        query = "SELECT user_id, username, email FROM users"
        return await database.fetch_all(query=query)

    query = "SELECT user_id, username, email FROM users WHERE "
    conditions = []
    values = {}

    if username:
        conditions.append("username = :username")
        values["username"] = username
    if email:
        conditions.append("email = :email")
        values["email"] = email

    if not conditions:
        raise ValueError("At least one of username or email must be provided.")

    query += " AND ".join(conditions)
    result = await database.fetch_all(query=query, values=values)
    return result

# Function to retrieve user by email and password for login
async def get_user_by_email_password(email: str, password_hash: str):
    query = "SELECT user_id, username, email FROM users WHERE email = :email AND password = :password"
    values = {"email": email, "password": password_hash}
    return await database.fetch_one(query=query, values=values)

async def connect_db():
    await database.connect()

async def disconnect_db():
    await database.disconnect()
