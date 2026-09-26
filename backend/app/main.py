
from fastapi import FastAPI

from app.routers.auth import router as auth_router
from app.routers.expenses import router as expenses_router


app = FastAPI(title="Expense Tracker API")
app.include_router(auth_router)
app.include_router(expenses_router)


@app.get("/")
def root():
    return {"message": "Expense Tracker API is running"}