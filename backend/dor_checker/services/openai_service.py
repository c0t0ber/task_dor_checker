import json
import logging
import os
from typing import Any

from openai import OpenAI

from dor_checker.models.schemas import Checklist, ChecklistItem
from dor_checker.services.storage_service import get_prompt

logger = logging.getLogger(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def _create_system_prompt(task_text: str, meta_info: str | None, checklist: Checklist) -> str:
    """Create system prompt for OpenAI."""
    base_prompt = get_prompt()

    prompt_parts = [
        base_prompt,
        f"\nТекст задачи:\n{task_text}",
    ]

    if meta_info:
        prompt_parts.append(f"\nМетаинформация:\n{meta_info}")

    prompt_parts.extend(
        [
            f"\nЧек-лист '{checklist.name}':",
            *[f"- {item}" for item in checklist.items],
            "\nОтветь ТОЛЬКО в JSON формате:",
            """{
  "recommendations": "конкретные рекомендации по улучшению задачи",
  "checklist_results": [
    {
      "item": "название пункта чек-листа",
      "status": "passed|failed|unclear",
      "comment": "комментарий к оценке"
    }
  ]
}""",
        ]
    )

    return "\n".join(prompt_parts)


def _parse_ai_response(response_text: str) -> dict[str, Any]:
    """Parse AI response and extract structured data."""
    try:
        # Try to find JSON in the response
        start_idx = response_text.find("{")
        end_idx = response_text.rfind("}") + 1

        if start_idx == -1 or end_idx == 0:
            raise ValueError("No JSON found in response")

        json_str = response_text[start_idx:end_idx]
        data: dict[str, Any] = json.loads(json_str)
        return data

    except (json.JSONDecodeError, ValueError) as e:
        logger.exception("Failed to parse AI response")
        raise RuntimeError("Failed to parse AI response") from e


async def check_task_dor(
    task_text: str, meta_info: str | None, checklist: Checklist
) -> tuple[str, list[ChecklistItem]]:
    """Check task against DoR using OpenAI."""
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY environment variable is not set")

    system_prompt = _create_system_prompt(task_text, meta_info, checklist)

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini", messages=[{"role": "user", "content": system_prompt}], max_tokens=2000, temperature=0.1
        )

        if not response.choices or not response.choices[0].message.content:
            raise RuntimeError("Empty response from OpenAI")

        response_data = _parse_ai_response(response.choices[0].message.content)

        recommendations = response_data.get("recommendations", "")
        checklist_results_data = response_data.get("checklist_results", [])

        checklist_results = [
            ChecklistItem(
                item=item_data.get("item", ""),
                status=item_data.get("status", "unclear"),
                comment=item_data.get("comment", ""),
            )
            for item_data in checklist_results_data
        ]

        return recommendations, checklist_results

    except Exception as e:
        logger.exception("Error calling OpenAI API")
        raise RuntimeError(f"Failed to check task with OpenAI: {str(e)}") from e
