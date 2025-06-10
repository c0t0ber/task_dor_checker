# Task DOR Checker - Development Commands

set dotenv-load

# Show available commands
default:
    just --list

# Install all dependencies
install:
    @echo "Installing backend dependencies..."
    cd backend && uv venv -p 3.12
    cd backend && uv pip install -r requirements.txt
    @echo "Installing frontend dependencies..."
    cd frontend && npm install
    @echo "All dependencies installed!"

# Run both backend and frontend in development mode
dev:
    echo "Starting backend and frontend..."
    cd backend && just run-app &
    BACKEND_PID=$!
    cd frontend && just dev &
    FRONTEND_PID=$!
    echo "Backend PID: $BACKEND_PID, Frontend PID: $FRONTEND_PID"
    echo "Backend: http://localhost:8000"
    echo "Frontend: http://localhost:3000"
    echo "Press Ctrl+C to stop both servers"
    trap "kill $BACKEND_PID $FRONTEND_PID" INT
    wait

# Run backend only
backend:
    cd backend && just run-app

# Run frontend only  
frontend:
    cd frontend && just dev


# Full setup: install dependencies and run
setup: install dev
