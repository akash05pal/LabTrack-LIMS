from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="LabTrack-LIMS API",
    description="Laboratory Information Management System Backend API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Pydantic Models
class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = "technician"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    is_active: bool = True

class SampleBase(BaseModel):
    sample_id: str
    patient_name: str
    sample_type: str
    collection_date: date
    priority: str = "normal"

class SampleCreate(SampleBase):
    pass

class Sample(SampleBase):
    id: int
    status: str = "pending"
    assigned_to: Optional[int] = None
    created_at: datetime
    updated_at: datetime

class TestBase(BaseModel):
    test_name: str
    test_type: str
    description: Optional[str] = None

class TestCreate(TestBase):
    pass

class Test(TestBase):
    id: int
    created_at: datetime

class TestResultBase(BaseModel):
    sample_id: int
    test_id: int
    result_value: str
    result_unit: Optional[str] = None
    reference_range: Optional[str] = None

class TestResultCreate(TestResultBase):
    pass

class TestResult(TestResultBase):
    id: int
    performed_by: int
    performed_at: datetime
    status: str = "completed"

class InventoryItemBase(BaseModel):
    item_name: str
    item_code: str
    category: str
    quantity: int
    unit: str
    min_threshold: int = 10

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItem(InventoryItemBase):
    id: int
    created_at: datetime
    updated_at: datetime

# Mock Database (In real implementation, this would be Supabase/PostgreSQL)
mock_users = [
    {
        "id": 1,
        "email": "admin@labtrack.com",
        "full_name": "Admin User",
        "role": "admin",
        "created_at": datetime.now(),
        "is_active": True
    },
    {
        "id": 2,
        "email": "tech@labtrack.com",
        "full_name": "Lab Technician",
        "role": "technician",
        "created_at": datetime.now(),
        "is_active": True
    }
]

mock_samples = [
    {
        "id": 1,
        "sample_id": "SAMP001",
        "patient_name": "John Doe",
        "sample_type": "blood",
        "collection_date": date.today(),
        "priority": "high",
        "status": "in_progress",
        "assigned_to": 2,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
]

mock_tests = [
    {
        "id": 1,
        "test_name": "Complete Blood Count",
        "test_type": "hematology",
        "description": "Analysis of blood cell counts",
        "created_at": datetime.now()
    }
]

mock_inventory = [
    {
        "id": 1,
        "item_name": "Test Tubes",
        "item_code": "TT001",
        "category": "consumables",
        "quantity": 500,
        "unit": "pieces",
        "min_threshold": 50,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
]

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Mock authentication - in real implementation, verify JWT token
    token = credentials.credentials
    # Here you would verify the token with Supabase Auth
    return {"user_id": 1, "role": "admin"}

# Health Check
@app.get("/")
async def root():
    return {"message": "LabTrack-LIMS API is running", "version": "1.0.0"}

# User Management Endpoints
@app.get("/users", response_model=List[User])
async def get_users(current_user: dict = Depends(get_current_user)):
    """Get all users"""
    return mock_users

@app.post("/users", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, current_user: dict = Depends(get_current_user)):
    """Create a new user"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create users")
    
    new_user = {
        "id": len(mock_users) + 1,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "created_at": datetime.now(),
        "is_active": True
    }
    mock_users.append(new_user)
    return new_user

# Sample Management Endpoints
@app.get("/samples", response_model=List[Sample])
async def get_samples(
    status: Optional[str] = None,
    assigned_to: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all samples with optional filtering"""
    samples = mock_samples
    if status:
        samples = [s for s in samples if s["status"] == status]
    if assigned_to:
        samples = [s for s in samples if s["assigned_to"] == assigned_to]
    return samples

@app.post("/samples", response_model=Sample, status_code=status.HTTP_201_CREATED)
async def create_sample(sample: SampleCreate, current_user: dict = Depends(get_current_user)):
    """Create a new sample"""
    new_sample = {
        "id": len(mock_samples) + 1,
        **sample.dict(),
        "status": "pending",
        "assigned_to": None,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    mock_samples.append(new_sample)
    return new_sample

@app.put("/samples/{sample_id}", response_model=Sample)
async def update_sample(
    sample_id: int,
    sample_update: dict,
    current_user: dict = Depends(get_current_user)
):
    """Update sample status or assignment"""
    for sample in mock_samples:
        if sample["id"] == sample_id:
            sample.update(sample_update)
            sample["updated_at"] = datetime.now()
            return sample
    raise HTTPException(status_code=404, detail="Sample not found")

# Test Management Endpoints
@app.get("/tests", response_model=List[Test])
async def get_tests(current_user: dict = Depends(get_current_user)):
    """Get all available tests"""
    return mock_tests

@app.post("/tests", response_model=Test, status_code=status.HTTP_201_CREATED)
async def create_test(test: TestCreate, current_user: dict = Depends(get_current_user)):
    """Create a new test type"""
    if current_user["role"] not in ["admin", "supervisor"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    new_test = {
        "id": len(mock_tests) + 1,
        **test.dict(),
        "created_at": datetime.now()
    }
    mock_tests.append(new_test)
    return new_test

# Inventory Management Endpoints
@app.get("/inventory", response_model=List[InventoryItem])
async def get_inventory(
    category: Optional[str] = None,
    low_stock: bool = False,
    current_user: dict = Depends(get_current_user)
):
    """Get inventory items with optional filtering"""
    items = mock_inventory
    if category:
        items = [item for item in items if item["category"] == category]
    if low_stock:
        items = [item for item in items if item["quantity"] <= item["min_threshold"]]
    return items

@app.post("/inventory", response_model=InventoryItem, status_code=status.HTTP_201_CREATED)
async def create_inventory_item(
    item: InventoryItemCreate,
    current_user: dict = Depends(get_current_user)
):
    """Add new inventory item"""
    new_item = {
        "id": len(mock_inventory) + 1,
        **item.dict(),
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    mock_inventory.append(new_item)
    return new_item

@app.put("/inventory/{item_id}", response_model=InventoryItem)
async def update_inventory_item(
    item_id: int,
    quantity_change: int,
    current_user: dict = Depends(get_current_user)
):
    """Update inventory quantity (inward/outward)"""
    for item in mock_inventory:
        if item["id"] == item_id:
            item["quantity"] += quantity_change
            item["updated_at"] = datetime.now()
            return item
    raise HTTPException(status_code=404, detail="Inventory item not found")

# Dashboard Statistics
@app.get("/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    """Get dashboard statistics"""
    total_samples = len(mock_samples)
    pending_samples = len([s for s in mock_samples if s["status"] == "pending"])
    completed_samples = len([s for s in mock_samples if s["status"] == "completed"])
    low_stock_items = len([i for i in mock_inventory if i["quantity"] <= i["min_threshold"]])
    
    return {
        "total_samples": total_samples,
        "pending_samples": pending_samples,
        "completed_samples": completed_samples,
        "low_stock_items": low_stock_items,
        "total_users": len(mock_users),
        "total_inventory_items": len(mock_inventory)
    }

# Reports Endpoints
@app.get("/reports/samples")
async def get_sample_report(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: dict = Depends(get_current_user)
):
    """Generate sample report"""
    return {
        "period": f"{start_date} to {end_date}" if start_date and end_date else "All time",
        "total_samples": len(mock_samples),
        "samples_by_status": {
            "pending": len([s for s in mock_samples if s["status"] == "pending"]),
            "in_progress": len([s for s in mock_samples if s["status"] == "in_progress"]),
            "completed": len([s for s in mock_samples if s["status"] == "completed"])
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 