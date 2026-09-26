
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas.auth import RegisterRequest
from app.security.password import hash_password




router = APIRouter(prefix="/auth", tags=["Authentication"])



@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registerd.")

    user = User(
        name = user_data.name,
        email = user_data.email,
        password_hash = hash_password(user_data.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)


    return {
        "message": "Registration Successful.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }
