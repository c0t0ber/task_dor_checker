import logging

from fastapi import APIRouter, HTTPException

from dor_checker.models.schemas import (
    Checklist,
    ChecklistRequest,
    ChecklistsResponse,
    PromptRequest,
    PromptResponse,
    SuccessResponse,
    TaskCheckRequest,
    TaskCheckResponse,
)
from dor_checker.services import storage_service
from dor_checker.services.openai_service import check_task_dor

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api")


@router.post("/check-dor", response_model=TaskCheckResponse)
async def check_dor(request: TaskCheckRequest) -> TaskCheckResponse:
    """Check task against DoR checklist."""
    try:
        # Validate checklist exists
        checklist = storage_service.get_checklist_by_id(request.checklist_id)
        if not checklist:
            raise HTTPException(status_code=404, detail="Checklist not found")

        # Call OpenAI service
        recommendations, checklist_results = await check_task_dor(request.task_text, request.meta_info, checklist)

        return TaskCheckResponse(status="success", recommendations=recommendations, checklist_results=checklist_results)

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error checking task DoR")
        return TaskCheckResponse(
            status="error", recommendations=f"Ошибка при проверке задачи: {str(e)}", checklist_results=[]
        )


@router.get("/checklists", response_model=ChecklistsResponse)
def get_checklists() -> ChecklistsResponse:
    """Get all checklists."""
    try:
        checklists = storage_service.get_all_checklists()
        return ChecklistsResponse(checklists=checklists)
    except Exception as e:
        logger.exception("Error getting checklists")
        raise HTTPException(status_code=500, detail="Failed to get checklists") from e


@router.post("/checklists", response_model=Checklist)
def create_checklist(request: ChecklistRequest) -> Checklist:
    """Create new checklist."""
    try:
        checklist = storage_service.create_checklist(request.name, request.items)
        return checklist
    except Exception as e:
        logger.exception("Error creating checklist")
        raise HTTPException(status_code=500, detail="Failed to create checklist") from e


@router.put("/checklists/{checklist_id}", response_model=Checklist)
def update_checklist(checklist_id: int, request: ChecklistRequest) -> Checklist:
    """Update existing checklist."""
    try:
        checklist = storage_service.update_checklist(checklist_id, request.name, request.items)
        if not checklist:
            raise HTTPException(status_code=404, detail="Checklist not found")
        return checklist
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error updating checklist")
        raise HTTPException(status_code=500, detail="Failed to update checklist") from e


@router.delete("/checklists/{checklist_id}", response_model=SuccessResponse)
def delete_checklist(checklist_id: int) -> SuccessResponse:
    """Delete checklist."""
    try:
        deleted = storage_service.delete_checklist(checklist_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Checklist not found")
        return SuccessResponse()
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error deleting checklist")
        raise HTTPException(status_code=500, detail="Failed to delete checklist") from e


@router.get("/prompt", response_model=PromptResponse)
def get_prompt() -> PromptResponse:
    """Get current prompt."""
    try:
        prompt = storage_service.get_prompt()
        return PromptResponse(prompt=prompt)
    except Exception as e:
        logger.exception("Error getting prompt")
        raise HTTPException(status_code=500, detail="Failed to get prompt") from e


@router.put("/prompt", response_model=SuccessResponse)
def update_prompt(request: PromptRequest) -> SuccessResponse:
    """Update prompt."""
    try:
        storage_service.update_prompt(request.prompt)
        return SuccessResponse()
    except Exception as e:
        logger.exception("Error updating prompt")
        raise HTTPException(status_code=500, detail="Failed to update prompt") from e
