#!/bin/bash

echo "🚀 Starting SEO & GEO Analysis Tool"
echo "=================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Start backend
echo "🔧 Starting backend server..."
cd backend
python3 -m pip install -r requirements.txt
python3 run.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend development server..."
cd ../frontend
npm install
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Application started successfully!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo "API Docs: http://localhost:5000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait

# Cleanup
echo "🛑 Stopping servers..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo "✅ Servers stopped"
