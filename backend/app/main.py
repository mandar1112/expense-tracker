
from fastapi import FastAPI

from app.routers.auth import router as auth_router



app = FastAPI(title="Expense Tracker API")
app.include_router(auth_router)


@app.get("/")
def root():
    return {"message": "Expense Tracker API is running"}