from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token security
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    token = credentials.credentials
    payload = verify_token(token)
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"email": email, "user_id": payload.get("user_id"), "role": payload.get("role")}

# Supabase Auth Integration (Mock implementation)
class SupabaseAuth:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_ANON_KEY")
    
    async def sign_up(self, email: str, password: str, user_data: dict):
        """Sign up a new user with Supabase Auth"""
        # In real implementation, this would call Supabase Auth API
        return {
            "user": {
                "id": "mock-user-id",
                "email": email,
                "user_metadata": user_data
            },
            "session": {
                "access_token": "mock-access-token",
                "refresh_token": "mock-refresh-token"
            }
        }
    
    async def sign_in(self, email: str, password: str):
        """Sign in user with Supabase Auth"""
        # In real implementation, this would call Supabase Auth API
        return {
            "user": {
                "id": "mock-user-id",
                "email": email
            },
            "session": {
                "access_token": "mock-access-token",
                "refresh_token": "mock-refresh-token"
            }
        }
    
    async def sign_out(self, access_token: str):
        """Sign out user with Supabase Auth"""
        # In real implementation, this would call Supabase Auth API
        return {"message": "Successfully signed out"}
    
    async def get_user(self, access_token: str):
        """Get user information from Supabase Auth"""
        # In real implementation, this would call Supabase Auth API
        return {
            "id": "mock-user-id",
            "email": "user@example.com",
            "role": "technician"
        }

# Initialize Supabase Auth
supabase_auth = SupabaseAuth() 