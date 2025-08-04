# LabTrack-LIMS Backend API

A robust FastAPI backend for the Laboratory Information Management System (LIMS) with Supabase/PostgreSQL integration.

## 🚀 Features

- **FastAPI Framework**: Modern, fast web framework with automatic API documentation
- **Supabase Integration**: PostgreSQL database with real-time features and RBAC
- **JWT Authentication**: Secure authentication with Supabase Auth
- **Comprehensive API**: Complete CRUD operations for all LIMS entities
- **Data Validation**: Pydantic models for request/response validation
- **Database Migrations**: Alembic for schema management
- **Testing Suite**: Comprehensive test coverage with pytest
- **Async Support**: Full async/await support for scalability

## 🛠 Tech Stack

- **Backend**: FastAPI (Python 3.8+)
- **Database**: Supabase/PostgreSQL
- **Authentication**: Supabase Auth with JWT
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Testing**: pytest
- **Documentation**: Automatic OpenAPI/Swagger docs

## 📋 Prerequisites

- Python 3.8 or higher
- PostgreSQL database (or Supabase account)
- pip package manager

## 🚀 Quick Start

### 1. Clone and Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost/labtrack

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=LabTrack-LIMS
```

### 3. Database Setup

```bash
# Initialize Alembic
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 4. Run the Application

```bash
# Development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production server
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 5. Access API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 📚 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### User Management
- `GET /users` - Get all users
- `POST /users` - Create new user
- `GET /users/{user_id}` - Get user by ID
- `PUT /users/{user_id}` - Update user
- `DELETE /users/{user_id}` - Delete user

### Sample Management
- `GET /samples` - Get all samples (with filtering)
- `POST /samples` - Create new sample
- `GET /samples/{sample_id}` - Get sample by ID
- `PUT /samples/{sample_id}` - Update sample
- `DELETE /samples/{sample_id}` - Delete sample

### Test Management
- `GET /tests` - Get all tests
- `POST /tests` - Create new test
- `GET /tests/{test_id}` - Get test by ID
- `PUT /tests/{test_id}` - Update test
- `DELETE /tests/{test_id}` - Delete test

### Inventory Management
- `GET /inventory` - Get all inventory items
- `POST /inventory` - Add new inventory item
- `GET /inventory/{item_id}` - Get inventory item by ID
- `PUT /inventory/{item_id}` - Update inventory item
- `DELETE /inventory/{item_id}` - Delete inventory item

### Dashboard & Reports
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /reports/samples` - Generate sample reports
- `GET /reports/inventory` - Generate inventory reports

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=.

# Run specific test file
pytest tests/test_api.py

# Run with verbose output
pytest -v
```

### Test Structure

```
tests/
├── test_api.py          # API endpoint tests
├── test_auth.py         # Authentication tests
├── test_models.py       # Pydantic model tests
└── conftest.py          # Test configuration
```

## 🗄 Database Schema

### Core Tables

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    full_name VARCHAR NOT NULL,
    role VARCHAR DEFAULT 'technician',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Samples table
CREATE TABLE samples (
    id SERIAL PRIMARY KEY,
    sample_id VARCHAR UNIQUE NOT NULL,
    patient_name VARCHAR NOT NULL,
    sample_type VARCHAR NOT NULL,
    collection_date DATE NOT NULL,
    priority VARCHAR DEFAULT 'normal',
    status VARCHAR DEFAULT 'pending',
    assigned_to INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tests table
CREATE TABLE tests (
    id SERIAL PRIMARY KEY,
    test_name VARCHAR NOT NULL,
    test_type VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Inventory items table
CREATE TABLE inventory_items (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR NOT NULL,
    item_code VARCHAR UNIQUE NOT NULL,
    category VARCHAR NOT NULL,
    quantity INTEGER DEFAULT 0,
    unit VARCHAR NOT NULL,
    min_threshold INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for different user roles
- **Input Validation**: Pydantic models ensure data integrity
- **CORS Configuration**: Proper CORS setup for frontend integration
- **Password Hashing**: bcrypt for secure password storage

## 📊 Performance Optimizations

- **Async/Await**: Full async support for better concurrency
- **Database Indexing**: Proper indexes on frequently queried fields
- **Connection Pooling**: Efficient database connection management
- **Caching**: Redis integration ready for caching

## 🚀 Deployment

### Docker Deployment

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

```bash
# Production environment variables
DATABASE_URL=postgresql://user:password@host:port/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SECRET_KEY=your-secret-key
ENVIRONMENT=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation at `/docs`
- Review the test files for usage examples 