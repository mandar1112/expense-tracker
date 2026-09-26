
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Expense, User
from app.schemas.expense import ExpenseCreate
from app.security.auth import get_current_user



router = APIRouter(prefix="/expenses", tags=["Expenses"])



@router.post("/", status_code=status.HTTP_201_CREATED)
def create_expenses(expense_data: ExpenseCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):

    expense = Expense(
        user_id = current_user.id,
        amount = expense_data.amount,
        description = expense_data.description,
        category = expense_data.category,
        expense_date = expense_data.expense_date
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)

    return {
        "message": "Expense created successfully",
        "expense": {
            "id": expense.id,
            "amount": expense.amount,
            "description": expense.description,
            "category": expense.category,
            "expense_date": expense.expense_date
        }
    }
