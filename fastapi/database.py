from databases import Database

POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = "password"
POSTGRES_DB = "finalproject"
POSTGRES_HOST = "127.0.0.1"
POSTGRES_PORT = "5432"

DATABASE_URL = f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}'
database = Database(DATABASE_URL)

# Insert new user (with gender and age)
async def insert_user(username: str, password_hash: str, email: str, gender: str, age: int):
    query = """
    INSERT INTO users (username, password, email, gender, age)
    VALUES (:username, :password, :email, :gender, :age)
    RETURNING user_id, username, email, gender, age
    """
    values = {"username": username, "password": password_hash, "email": email, "gender": gender, "age": age}
    return await database.fetch_one(query=query, values=values)

# For user login
async def get_user_by_username_password(username: str, password_hash: str):
    query = "SELECT user_id, username, email FROM users WHERE username = :username AND password = :password"
    values = {"username": username, "password": password_hash}
    return await database.fetch_one(query=query, values=values)

# For admin login
async def get_admin_by_username_password(username: str, password_hash: str):
    query = """
    SELECT admin_id, username, email FROM "Admin"
    WHERE username = :username AND password = :password
    """
    values = {"username": username, "password": password_hash}
    return await database.fetch_one(query=query, values=values)

async def connect_db():
    await database.connect()

async def disconnect_db():
    await database.disconnect()
