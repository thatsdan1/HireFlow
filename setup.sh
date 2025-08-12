#!/bin/bash

echo "🚀 Setting up HireFlow Application..."
echo "===================================="

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🔧 Creating Python virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created!"
else
    echo "✅ Virtual environment already exists!"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements-simple.txt
echo "✅ Backend dependencies installed!"

# Set up database
echo "🗄️  Setting up database..."
if [ ! -f "alembic.ini" ]; then
    echo "❌ Alembic configuration not found. Please run the setup manually."
    exit 1
fi

# Run database migrations
echo "🔄 Running database migrations..."
alembic upgrade head
echo "✅ Database setup complete!"

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd hireflow-frontend
npm install
echo "✅ Frontend dependencies installed!"

cd ..

echo ""
echo "🎉 Setup complete! Your HireFlow application is ready to run."
echo ""
echo "To start the application:"
echo "  ./start.sh"
echo ""
echo "To start only the backend:"
echo "  cd backend && source ../venv/bin/activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "To start only the frontend:"
echo "  cd hireflow-frontend && npm start"
echo ""
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔌 Backend API will be available at: http://localhost:8000"
echo "📚 API Documentation will be available at: http://localhost:8000/docs" 