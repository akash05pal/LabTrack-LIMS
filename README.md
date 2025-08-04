# LabTrack-LIMS 🧪

A modern, comprehensive Laboratory Information Management System (LIMS) built with Next.js, TypeScript, and FastAPI backend.

## 🌐 Live Demo

**🔗 [View Live Demo](https://skilims01.vercel.app/)**

Experience the full LabTrack-LIMS system in action with all features and functionality.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Frontend Setup](#-frontend-setup)
- [Backend Setup](#-backend-setup)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### 🎯 Core LIMS Functionality
- **Sample Management**: Track and manage laboratory samples throughout their lifecycle
- **Test Scheduling**: Schedule and monitor test procedures with real-time updates
- **User Management**: Role-based access control for laboratory staff
- **Inventory Management**: Complete stock tracking with low-stock alerts
- **Reporting System**: Generate comprehensive test and inventory reports
- **Real-time Dashboard**: Monitor laboratory activities with live statistics

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Modern Components**: Built with shadcn/ui for consistent design
- **Interactive Charts**: Visual data representation with Recharts
- **Real-time Updates**: Live notifications and status updates

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Different permissions for admins, supervisors, and technicians
- **Data Validation**: Comprehensive input validation and sanitization
- **Secure API**: Protected endpoints with proper authorization

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks and context

### Backend
- **Framework**: FastAPI (Python)
- **Database**: Supabase/PostgreSQL
- **Authentication**: Supabase Auth with JWT
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Testing**: pytest
- **Documentation**: Automatic OpenAPI/Swagger docs

### Infrastructure
- **Hosting**: Vercel (Frontend)
- **Database**: Supabase
- **Containerization**: Docker
- **CI/CD**: GitHub Actions ready

---

## 📁 Project Structure

```
LabTrack-LIMS/
├── src/                          # Frontend source code
│   ├── app/                      # Next.js app directory
│   │   ├── dashboard/           # Dashboard pages
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/              # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   └── dashboard/          # Dashboard components
│   ├── lib/                     # Utility functions
│   ├── hooks/                   # Custom React hooks
│   └── ai/                      # AI integration
├── backend/                      # FastAPI backend
│   ├── main.py                  # Main FastAPI application
│   ├── database.py              # Database models and configuration
│   ├── auth.py                  # Authentication logic
│   ├── models.py                # Pydantic models
│   ├── tests/                   # Test suite
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile              # Container configuration
│   └── README.md               # Backend documentation
├── docs/                        # Project documentation
├── package.json                 # Frontend dependencies
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **Python** 3.8+
- **npm** or **yarn**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/akash05pal/LabTrack-LIMS.git
cd LabTrack-LIMS
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## 🎨 Frontend Setup (Detailed)

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration (Optional - for future integration)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# AI Integration
npm run genkit:dev       # Start AI development server
npm run genkit:watch     # Watch AI development server

# Type checking
npm run typecheck        # Run TypeScript type checking
```

### Key Features

- **Dashboard**: Real-time statistics and activity feed
- **Sample Management**: Complete sample lifecycle tracking
- **Inventory Management**: Stock tracking with alerts
- **User Management**: Role-based access control
- **Reports**: Comprehensive reporting system
- **Responsive Design**: Works on all devices

---

## 🔧 Backend Setup (Detailed)

### Environment Configuration

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

### Database Setup

```bash
# Initialize Alembic (if not already done)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### Running the Backend

```bash
# Development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production server
uvicorn main:app --host 0.0.0.0 --port 8000

# With Docker
docker-compose up
```

### API Endpoints

The backend provides comprehensive REST API endpoints:

- **Authentication**: `/auth/*` - Login, register, logout
- **Users**: `/users/*` - User management
- **Samples**: `/samples/*` - Sample management
- **Tests**: `/tests/*` - Test management
- **Inventory**: `/inventory/*` - Inventory management
- **Dashboard**: `/dashboard/*` - Statistics and reports

---

## 📚 API Documentation

### Interactive Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### Example API Calls

```bash
# Get all samples
curl -X GET "http://localhost:8000/samples" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create new sample
curl -X POST "http://localhost:8000/samples" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "sample_id": "SAMP001",
    "patient_name": "John Doe",
    "sample_type": "blood",
    "collection_date": "2024-01-15",
    "priority": "normal"
  }'

# Get dashboard statistics
curl -X GET "http://localhost:8000/dashboard/stats" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect to Vercel**:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Environment Variables**: Set in Vercel dashboard

### Backend Deployment

#### Option 1: Docker Deployment

```bash
# Build and run with Docker
docker build -t labtrack-backend .
docker run -p 8000:8000 labtrack-backend
```

#### Option 2: Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Option 3: Manual Deployment

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="your_database_url"
export SECRET_KEY="your_secret_key"

# Run with gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Database Setup

1. **Supabase Setup**:
   - Create a new Supabase project
   - Get your project URL and API keys
   - Update environment variables

2. **Local PostgreSQL**:
   ```bash
   # Install PostgreSQL
   sudo apt-get install postgresql postgresql-contrib

   # Create database
   sudo -u postgres createdb labtrack

   # Run migrations
   alembic upgrade head
   ```

---

## 🧪 Testing

### Frontend Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- --testNamePattern="Dashboard"
```

### Backend Testing

```bash
# Navigate to backend directory
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=.

# Run specific test file
pytest tests/test_api.py

# Run with verbose output
pytest -v
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 1. Fork the Repository

```bash
git clone https://github.com/your-username/LabTrack-LIMS.git
cd LabTrack-LIMS
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes

- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes

```bash
# Frontend tests
npm test

# Backend tests
cd backend && pytest
```

### 5. Submit a Pull Request

- Provide a clear description of your changes
- Include any relevant issue numbers
- Ensure all tests pass

### Development Guidelines

- **Code Style**: Follow ESLint and Prettier configurations
- **TypeScript**: Use strict typing
- **Testing**: Maintain good test coverage
- **Documentation**: Update README and API docs
- **Commits**: Use conventional commit messages

---

## 📊 Performance & Monitoring

### Frontend Performance

- **Bundle Analysis**: `npm run analyze`
- **Lighthouse**: Run performance audits
- **Core Web Vitals**: Monitor loading metrics

### Backend Performance

- **API Response Times**: Monitor endpoint performance
- **Database Queries**: Optimize slow queries
- **Memory Usage**: Monitor resource consumption

### Monitoring Tools

- **Frontend**: Vercel Analytics
- **Backend**: Application logging
- **Database**: Supabase dashboard

---

## 🔒 Security

### Security Features

- **JWT Authentication**: Secure token-based auth
- **CORS Configuration**: Proper cross-origin setup
- **Input Validation**: Comprehensive data validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Content Security Policy
- **Rate Limiting**: API request throttling

### Security Best Practices

- Keep dependencies updated
- Use environment variables for secrets
- Implement proper error handling
- Regular security audits
- Follow OWASP guidelines

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

### Getting Help

- **Documentation**: Check the API docs at `/docs`
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Email**: Contact the maintainers

### Common Issues

#### Frontend Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run typecheck

# Verify environment variables
echo $NEXT_PUBLIC_API_URL
```

#### Backend Issues

```bash
# Check database connection
python -c "from database import engine; print(engine.connect())"

# Verify environment variables
python -c "import os; print(os.getenv('DATABASE_URL'))"

# Reset database
alembic downgrade base
alembic upgrade head
```

---

## 🎉 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **FastAPI**: For the high-performance Python web framework
- **Supabase**: For the excellent backend-as-a-service
- **shadcn/ui**: For the beautiful component library
- **Vercel**: For the seamless deployment platform

---

## 📈 Roadmap

### Upcoming Features

- [ ] **Real-time Notifications**: WebSocket integration
- [ ] **Advanced Analytics**: Machine learning insights
- [ ] **Mobile App**: React Native application
- [ ] **API Rate Limiting**: Enhanced security
- [ ] **Multi-tenant Support**: Multiple laboratory support
- [ ] **Advanced Reporting**: Custom report builder
- [ ] **Integration APIs**: Third-party system integration
- [ ] **Audit Trail**: Complete activity logging

### Performance Improvements

- [ ] **Caching Layer**: Redis integration
- [ ] **CDN Optimization**: Static asset delivery
- [ ] **Database Optimization**: Query optimization
- [ ] **Bundle Optimization**: Code splitting improvements

---

**🌟 Star this repository if you find it helpful!**

**🔗 [Live Demo](https://skilims01.vercel.app/) | [GitHub Repository](https://github.com/akash05pal/LabTrack-LIMS)**
