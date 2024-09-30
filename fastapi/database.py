from databases import Database

# PostgreSQL connection details
POSTGRES_USER = "user"
POSTGRES_PASSWORD = "password"
POSTGRES_DB = "finalproject"
POSTGRES_HOST = "db"
POSTGRES_PORT = "5432"

DATABASE_URL = f'postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}'

# Create a Database instance
database = Database(DATABASE_URL)

# Function to insert a new user into the 'User' table
async def insert_user(username: str, password_hash: str, email: str):
    query = """
    INSERT INTO "User" (username, password, email)
    VALUES (:username, :password, :email)
    RETURNING user_id, username, email
    """
    values = {"username": username, "password": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)

# Function to connect to the database
async def connect_db():
    await database.connect()

# Function to disconnect from the database
async def disconnect_db():
    await database.disconnect()
