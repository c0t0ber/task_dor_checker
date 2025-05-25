from datetime import datetime

from pydantic import BaseModel, Field


class DorCriterionRequest(BaseModel):
    criterion: str = Field(..., min_length=1, max_length=500)
    order_index: int = Field(default=0, ge=0)


class DorCriterionResponse(BaseModel):
    id: int
    criterion: str
    order_index: int


class CreateDorRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: str = Field(default="", max_length=1000)
    criteria: list[str] = Field(..., min_length=1, max_length=20)


class UpdateDorRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: str = Field(default="", max_length=1000)
    criteria: list[str] = Field(..., min_length=1, max_length=20)


class DorListResponse(BaseModel):
    id: int
    name: str
    description: str
    criteria_count: int
    created_at: datetime


class DorDetailResponse(BaseModel):
    id: int
    name: str
    description: str
    criteria: list[DorCriterionResponse]
    created_at: datetime
    updated_at: datetime


class CreateDorResponse(BaseModel):
    id: int
    message: str


class DeleteDorResponse(BaseModel):
    message: str


class CheckTaskRequest(BaseModel):
    dor_id: int = Field(..., gt=0)
    task_text: str = Field(..., min_length=1, max_length=5000)


class CriterionCheckResult(BaseModel):
    criterion: str
    passed: bool
    comment: str


class CheckTaskResponse(BaseModel):
    dor_name: str
    total_criteria: int
    passed_criteria: int
    pass_rate: int
    results: list[CriterionCheckResult]


class ErrorResponse(BaseModel):
    detail: str


class AICriterionCheck(BaseModel):
    passed: bool
    comment: str
