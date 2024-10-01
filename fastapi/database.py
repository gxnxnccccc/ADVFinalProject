from databases import Database
import psycopg2

# PostgreSQL connection details
POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = "password"
POSTGRES_DB = "finalproject"
POSTGRES_HOST = "127.0.0.1"
POSTGRES_PORT = "5432"

print(1234)
DATABASE_URL = f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}'
# DATABASE_URL = "postgresql://postgres:password@127.0.0.1:5432/finalproject"

try:
    connection = psycopg2.connect(
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        database=POSTGRES_DB,
        host=POSTGRES_HOST,
        port=POSTGRES_PORT
    )
    print("Connected to the database successfully!")
except Exception as e:
    print("Error connecting to the database:", e)



# Create a Database instance
database = Database(DATABASE_URL)

# Function to insert a new user into the 'User' table
async def insert_user(username: str, password_hash: str, email: str):
    query = """
    INSERT INTO users_new (username, password, email)
    VALUES (:username, :password, :email)
    RETURNING id, username, email
    """
    values = {"username": username, "password": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)

async def select_user(username: str = None, email: str = None):
    # ถ้าทั้ง username และ email ไม่มีค่า ให้ดึงข้อมูลทั้งหมด
    if username is None and email is None:
        query = "SELECT id, username, email FROM users_new"
        return await database.fetch_all(query=query)

    # ถ้ามีการระบุ username หรือ email
    query = "SELECT id, username, email FROM users_new WHERE "
    conditions = []
    values = {}

    if username:
        conditions.append("username = :username")
        values["username"] = username
    if email:
        conditions.append("email = :email")
        values["email"] = email  # เพิ่มการใส่ค่า email ลงใน values

    if not conditions:
        raise ValueError("At least one of username or email must be provided.")

    query += " AND ".join(conditions)

    result = await database.fetch_all(query=query, values=values)  # ใช้ fetch_all แทน fetch_one
    return result



# Function to connect to the database
async def connect_db():
    await database.connect()

# Function to disconnect from the database
async def disconnect_db():
    await database.disconnect()
