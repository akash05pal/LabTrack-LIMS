from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date
from enum import Enum

# Enums
class SampleStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class SamplePriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"

class UserRole(str, Enum):
    ADMIN = "admin"
    SUPERVISOR = "supervisor"
    TECHNICIAN = "technician"
    VIEWER = "viewer"

class TestType(str, Enum):
    HEMATOLOGY = "hematology"
    BIOCHEMISTRY = "biochemistry"
    MICROBIOLOGY = "microbiology"
    IMMUNOLOGY = "immunology"
    MOLECULAR = "molecular"

class InventoryCategory(str, Enum):
    CONSUMABLES = "consumables"
    EQUIPMENT = "equipment"
    REAGENTS = "reagents"
    SUPPLIES = "supplies"

# Base Models
class UserBase(BaseModel):
    email: str = Field(..., description="User email address")
    full_name: str = Field(..., description="User full name")
    role: UserRole = Field(default=UserRole.TECHNICIAN, description="User role")

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="User password")

class UserUpdate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: int
    is_active: bool = True
    created_at: datetime
    
    class Config:
        from_attributes = True

class SampleBase(BaseModel):
    sample_id: str = Field(..., description="Unique sample identifier")
    patient_name: str = Field(..., description="Patient name")
    sample_type: str = Field(..., description="Type of sample")
    collection_date: date = Field(..., description="Sample collection date")
    priority: SamplePriority = Field(default=SamplePriority.NORMAL, description="Sample priority")

class SampleCreate(SampleBase):
    pass

class SampleUpdate(BaseModel):
    status: Optional[SampleStatus] = None
    assigned_to: Optional[int] = None
    priority: Optional[SamplePriority] = None

class Sample(SampleBase):
    id: int
    status: SampleStatus = SampleStatus.PENDING
    assigned_to: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class TestBase(BaseModel):
    test_name: str = Field(..., description="Name of the test")
    test_type: TestType = Field(..., description="Type of test")
    description: Optional[str] = Field(None, description="Test description")

class TestCreate(TestBase):
    pass

class TestUpdate(BaseModel):
    test_name: Optional[str] = None
    test_type: Optional[TestType] = None
    description: Optional[str] = None

class Test(TestBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class TestResultBase(BaseModel):
    sample_id: int = Field(..., description="Sample ID")
    test_id: int = Field(..., description="Test ID")
    result_value: str = Field(..., description="Test result value")
    result_unit: Optional[str] = Field(None, description="Result unit")
    reference_range: Optional[str] = Field(None, description="Reference range")

class TestResultCreate(TestResultBase):
    pass

class TestResultUpdate(BaseModel):
    result_value: Optional[str] = None
    result_unit: Optional[str] = None
    reference_range: Optional[str] = None
    status: Optional[str] = None

class TestResult(TestResultBase):
    id: int
    performed_by: int
    performed_at: datetime
    status: str = "completed"
    
    class Config:
        from_attributes = True

class InventoryItemBase(BaseModel):
    item_name: str = Field(..., description="Item name")
    item_code: str = Field(..., description="Unique item code")
    category: InventoryCategory = Field(..., description="Item category")
    quantity: int = Field(ge=0, description="Current quantity")
    unit: str = Field(..., description="Unit of measurement")
    min_threshold: int = Field(default=10, ge=0, description="Minimum stock threshold")

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItemUpdate(BaseModel):
    item_name: Optional[str] = None
    category: Optional[InventoryCategory] = None
    quantity: Optional[int] = None
    unit: Optional[str] = None
    min_threshold: Optional[int] = None

class InventoryItem(InventoryItemBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class InventoryTransactionBase(BaseModel):
    item_id: int = Field(..., description="Inventory item ID")
    quantity_change: int = Field(..., description="Quantity change (positive for inward, negative for outward)")
    transaction_type: str = Field(..., description="Type of transaction (inward/outward)")
    reason: Optional[str] = Field(None, description="Reason for transaction")

class InventoryTransactionCreate(InventoryTransactionBase):
    pass

class InventoryTransaction(InventoryTransactionBase):
    id: int
    performed_by: int
    performed_at: datetime
    
    class Config:
        from_attributes = True

# Dashboard Models
class DashboardStats(BaseModel):
    total_samples: int
    pending_samples: int
    completed_samples: int
    low_stock_items: int
    total_users: int
    total_inventory_items: int

class SampleReport(BaseModel):
    period: str
    total_samples: int
    samples_by_status: dict
    samples_by_type: dict
    average_processing_time: Optional[float] = None

# Authentication Models
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: User

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None
    role: Optional[str] = None

# Response Models
class PaginatedResponse(BaseModel):
    items: List[dict]
    total: int
    page: int
    size: int
    pages: int

class SuccessResponse(BaseModel):
    message: str
    data: Optional[dict] = None

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None 