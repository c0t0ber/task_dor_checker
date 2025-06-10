import json
import logging
from pathlib import Path
from typing import Any

from dor_checker.models.schemas import Checklist

logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).parent.parent / "data"
CHECKLISTS_FILE = DATA_DIR / "checklists.json"
PROMPT_FILE = DATA_DIR / "prompt.json"


def _ensure_data_dir() -> None:
    """Ensure data directory exists."""
    DATA_DIR.mkdir(exist_ok=True)


def _load_json_file(file_path: Path) -> dict[str, Any]:
    """Load JSON data from file."""
    if not file_path.exists():
        return {}

    try:
        with file_path.open("r", encoding="utf-8") as f:
            data: dict[str, Any] = json.load(f)
            return data
    except (json.JSONDecodeError, OSError) as e:
        logger.exception(f"Error loading {file_path}")
        raise RuntimeError(f"Failed to load data from {file_path}") from e


def _save_json_file(file_path: Path, data: dict[str, Any]) -> None:
    """Save JSON data to file."""
    _ensure_data_dir()

    try:
        with file_path.open("w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except OSError as e:
        logger.exception(f"Error saving {file_path}")
        raise RuntimeError(f"Failed to save data to {file_path}") from e


def get_all_checklists() -> list[Checklist]:
    """Get all checklists."""
    data = _load_json_file(CHECKLISTS_FILE)
    checklists_data = data.get("checklists", [])
    return [Checklist(**checklist) for checklist in checklists_data]


def get_checklist_by_id(checklist_id: int) -> Checklist | None:
    """Get checklist by ID."""
    checklists = get_all_checklists()
    for checklist in checklists:
        if checklist.id == checklist_id:
            return checklist
    return None


def create_checklist(name: str, items: list[str]) -> Checklist:
    """Create new checklist."""
    data = _load_json_file(CHECKLISTS_FILE)

    if "checklists" not in data:
        data["checklists"] = []
    if "next_id" not in data:
        data["next_id"] = 1

    new_id = data["next_id"]
    new_checklist = Checklist(id=new_id, name=name, items=items)

    data["checklists"].append(new_checklist.model_dump())
    data["next_id"] = new_id + 1

    _save_json_file(CHECKLISTS_FILE, data)
    return new_checklist


def update_checklist(checklist_id: int, name: str, items: list[str]) -> Checklist | None:
    """Update existing checklist."""
    data = _load_json_file(CHECKLISTS_FILE)
    checklists = data.get("checklists", [])

    for i, checklist in enumerate(checklists):
        if checklist["id"] == checklist_id:
            updated_checklist = Checklist(id=checklist_id, name=name, items=items)
            checklists[i] = updated_checklist.model_dump()
            _save_json_file(CHECKLISTS_FILE, data)
            return updated_checklist

    return None


def delete_checklist(checklist_id: int) -> bool:
    """Delete checklist by ID."""
    data = _load_json_file(CHECKLISTS_FILE)
    checklists = data.get("checklists", [])

    for i, checklist in enumerate(checklists):
        if checklist["id"] == checklist_id:
            del checklists[i]
            _save_json_file(CHECKLISTS_FILE, data)
            return True

    return False


def get_prompt() -> str:
    """Get current prompt."""
    data = _load_json_file(PROMPT_FILE)
    prompt: str = data.get("prompt", "")
    return prompt


def update_prompt(prompt: str) -> None:
    """Update prompt."""
    data = {"prompt": prompt}
    _save_json_file(PROMPT_FILE, data)
