
from app.database import Base, engine
from app.models import Expense, User


# To create tables in the database
Base.metadata.create_all(bind=engine)
print("Database tables created successfully")
