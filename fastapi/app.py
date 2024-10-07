# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from database import connect_db, disconnect_db
# from routes.users import router

# app = FastAPI()

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://127.0.0.1:3000"],  # Allow all origins (consider specifying your frontend URL in production)
#     allow_credentials=True,
#     allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
#     allow_headers=["*"],  # Allow all headers
# )

# # Include the users router with the '/api' prefix
# app.include_router(router, prefix="/api")

# # Event handler for starting up the application
# @app.on_event("startup")
# async def startup():
#     # Connect to the database
#     await connect_db()

# # Event handler for shutting down the application
# @app.on_event("shutdown")
# async def shutdown():
#     # Disconnect from the database
#     await disconnect_db()


from fastapi import FastAPI
from routes import users  # Import your router

app = FastAPI()

app.include_router(users.router, prefix="/api")
