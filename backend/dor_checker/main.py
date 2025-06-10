import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dor_checker.api.routes import router

# Configure logging
logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="DoR Checker API",
    description="REST API для проверки задач на соответствие Definition of Ready",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене стоит ограничить
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)


@app.get("/")
def root() -> dict[str, str]:
    """Root endpoint."""
    return {"message": "DoR Checker API is running"}


@app.get("/health")
def health() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}
