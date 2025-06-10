from pydantic import BaseModel


class TaskCheckRequest(BaseModel):
    task_text: str
    meta_info: str | None = None
    checklist_id: int


class ChecklistItem(BaseModel):
    item: str
    status: str  # "passed" | "failed" | "unclear"
    comment: str


class TaskCheckResponse(BaseModel):
    status: str  # "success" | "error"
    recommendations: str
    checklist_results: list[ChecklistItem]


class Checklist(BaseModel):
    id: int
    name: str
    items: list[str]


class ChecklistRequest(BaseModel):
    name: str
    items: list[str]


class ChecklistsResponse(BaseModel):
    checklists: list[Checklist]


class PromptResponse(BaseModel):
    prompt: str


class PromptRequest(BaseModel):
    prompt: str


class SuccessResponse(BaseModel):
    status: str = "success"
