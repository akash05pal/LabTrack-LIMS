from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Date, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL (in production, this would be Supabase PostgreSQL URL)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/labtrack")

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    role = Column(String, default="technician")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Sample(Base):
    __tablename__ = "samples"
    
    id = Column(Integer, primary_key=True, index=True)
    sample_id = Column(String, unique=True, index=True)
    patient_name = Column(String)
    sample_type = Column(String)
    collection_date = Column(Date)
    priority = Column(String, default="normal")
    status = Column(String, default="pending")
    assigned_to = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Test(Base):
    __tablename__ = "tests"
    
    id = Column(Integer, primary_key=True, index=True)
    test_name = Column(String)
    test_type = Column(String)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TestResult(Base):
    __tablename__ = "test_results"
    
    id = Column(Integer, primary_key=True, index=True)
    sample_id = Column(Integer)
    test_id = Column(Integer)
    result_value = Column(String)
    result_unit = Column(String, nullable=True)
    reference_range = Column(String, nullable=True)
    performed_by = Column(Integer)
    performed_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="completed")

class InventoryItem(Base):
    __tablename__ = "inventory_items"
    
    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String)
    item_code = Column(String, unique=True, index=True)
    category = Column(String)
    quantity = Column(Integer)
    unit = Column(String)
    min_threshold = Column(Integer, default=10)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine) 