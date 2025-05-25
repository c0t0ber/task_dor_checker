import logging
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from dor_checker.ai_analyzer import AIAnalyzer
from dor_checker.database import (
    create_default_dors,
    create_dor,
    delete_dor,
    get_all_dors,
    get_dor_by_id,
    init_database,
    update_dor,
)
from dor_checker.models import (
    CheckTaskRequest,
    CheckTaskResponse,
    CreateDorRequest,
    CreateDorResponse,
    DeleteDorResponse,
    DorDetailResponse,
    DorListResponse,
    UpdateDorRequest,
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> Any:
    """Application lifespan events."""
    # Startup
    logger.info("Starting DoR Checker application")
    init_database()
    create_default_dors()
    yield
    # Shutdown
    logger.info("Shutting down DoR Checker application")


app = FastAPI(
    title="DoR Checker API",
    description="API for checking tasks against Definition of Ready criteria",
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI analyzer
ai_analyzer = AIAnalyzer()


@app.post("/api/dor/create", response_model=CreateDorResponse)
async def create_dor_endpoint(request: CreateDorRequest) -> CreateDorResponse:
    """Create a new DoR template."""
    try:
        dor_id = create_dor(request.name, request.description, request.criteria)
        return CreateDorResponse(id=dor_id, message="DoR успешно создан")
    except Exception:
        logger.exception("Error creating DoR")
        raise HTTPException(status_code=500, detail="Ошибка при создании DoR")


@app.get("/api/dor/list", response_model=list[DorListResponse])
async def list_dors_endpoint() -> list[DorListResponse]:
    """Get list of all DoR templates."""
    try:
        dors_data = get_all_dors()
        return [DorListResponse(**dor) for dor in dors_data]
    except Exception:
        logger.exception("Error fetching DoR list")
        raise HTTPException(status_code=500, detail="Ошибка при получении списка DoR")


@app.get("/api/dor/{dor_id}", response_model=DorDetailResponse)
async def get_dor_endpoint(dor_id: int) -> DorDetailResponse:
    """Get a specific DoR template by ID."""
    try:
        dor_data = get_dor_by_id(dor_id)
        if not dor_data:
            raise HTTPException(status_code=404, detail="DoR не найден")

        return DorDetailResponse(**dor_data)
    except HTTPException:
        raise
    except Exception:
        logger.exception(f"Error fetching DoR {dor_id}")
        raise HTTPException(status_code=500, detail="Ошибка при получении DoR")


@app.put("/api/dor/{dor_id}", response_model=CreateDorResponse)
async def update_dor_endpoint(dor_id: int, request: UpdateDorRequest) -> CreateDorResponse:
    """Update a DoR template."""
    try:
        success = update_dor(dor_id, request.name, request.description, request.criteria)
        if not success:
            raise HTTPException(status_code=404, detail="DoR не найден")

        return CreateDorResponse(id=dor_id, message="DoR успешно обновлен")
    except HTTPException:
        raise
    except Exception:
        logger.exception(f"Error updating DoR {dor_id}")
        raise HTTPException(status_code=500, detail="Ошибка при обновлении DoR")


@app.delete("/api/dor/{dor_id}", response_model=DeleteDorResponse)
async def delete_dor_endpoint(dor_id: int) -> DeleteDorResponse:
    """Delete a DoR template."""
    try:
        success = delete_dor(dor_id)
        if not success:
            raise HTTPException(status_code=404, detail="DoR не найден")

        return DeleteDorResponse(message="DoR успешно удален")
    except HTTPException:
        raise
    except Exception:
        logger.exception(f"Error deleting DoR {dor_id}")
        raise HTTPException(status_code=500, detail="Ошибка при удалении DoR")


@app.post("/api/check", response_model=CheckTaskResponse)
async def check_task_endpoint(request: CheckTaskRequest) -> CheckTaskResponse:
    """Check a task against DoR criteria."""
    try:
        # Get DoR template
        dor_data = get_dor_by_id(request.dor_id)
        if not dor_data:
            raise HTTPException(status_code=404, detail="DoR не найден")

        # Extract criteria
        criteria = [criterion["criterion"] for criterion in dor_data["criteria"]]

        # Check task against criteria
        results = ai_analyzer.check_all_criteria(criteria, request.task_text)

        # Calculate statistics
        passed_count = sum(1 for result in results if result.passed)
        total_count = len(results)
        pass_rate = int((passed_count / total_count) * 100) if total_count > 0 else 0

        return CheckTaskResponse(
            dor_name=dor_data["name"],
            total_criteria=total_count,
            passed_criteria=passed_count,
            pass_rate=pass_rate,
            results=results,
        )

    except HTTPException:
        raise
    except Exception:
        logger.exception("Error checking task")
        raise HTTPException(status_code=500, detail="Ошибка при проверке задачи")


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
