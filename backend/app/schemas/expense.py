
from datetime import date
from pydantic import BaseModel, Field


class ExpenseCreate(BaseModel):
    amount: float = Field(gt=0)
    description: str
    category: str
    expense_date: date