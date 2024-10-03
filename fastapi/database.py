from databases import Database

POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = "password"
POSTGRES_DB = "finalproject"
POSTGRES_HOST = "127.0.0.1"
POSTGRES_PORT = "5432"

DATABASE_URL = f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}'
database = Database(DATABASE_URL)

async def insert_user(username: str, password_hash: str, email: str, gender: str, age: int, phone_number: str = None):
    query = """
    INSERT INTO users (username, password, email, gender, age, phone_number)
    VALUES (:username, :password, :email, :gender, :age, :phone_number)
    RETURNING user_id, username, email, gender, age, phone_number
    """
    values = {"username": username, "password": password_hash, "email": email, "gender": gender, "age": age, "phone_number": phone_number}
    return await database.fetch_one(query=query, values=values)

async def get_all_users():
    query = "SELECT * FROM users"
    user_data = await database.fetch_one(query=query)
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

async def connect_db():
    await database.connect()

async def disconnect_db():
    await database.disconnect()