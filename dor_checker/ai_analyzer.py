import json
import logging
import os

from openai import OpenAI

from dor_checker.models import AICriterionCheck, CriterionCheckResult

logger = logging.getLogger(__name__)


class AIAnalyzer:
    def __init__(self) -> None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")

        self.client = OpenAI(api_key=api_key)

    def create_check_prompt(self, criterion: str, task_text: str) -> str:
        """Create a prompt for checking a criterion against task text."""
        return f"""
Проверь, выполняется ли следующий критерий DoR в тексте задачи.

Критерий: {criterion}

Текст задачи:
{task_text}

Ответь в формате JSON:
{{
    "passed": true/false,
    "comment": "Короткий комментарий что добавить или почему критерий выполнен"
}}

Будь объективным и конструктивным. Если критерий не выполнен, дай конкретные рекомендации по улучшению.
Если выполнен, кратко объясни почему.
        """.strip()

    def check_criterion(self, criterion: str, task_text: str) -> CriterionCheckResult:
        """Check a single criterion against task text using AI."""
        try:
            prompt = self.create_check_prompt(criterion, task_text)

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "Ты эксперт по анализу задач и Definition of Ready. Отвечай только в указанном JSON формате.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.1,
                max_tokens=200,
            )

            content = response.choices[0].message.content
            if not content:
                raise ValueError("Empty response from OpenAI")

            # Parse JSON response
            result_data = json.loads(content)
            ai_check = AICriterionCheck(**result_data)

            return CriterionCheckResult(criterion=criterion, passed=ai_check.passed, comment=ai_check.comment)

        except json.JSONDecodeError:
            logger.exception(f"Failed to parse AI response for criterion: {criterion}")
            return CriterionCheckResult(
                criterion=criterion, passed=False, comment="Ошибка анализа критерия. Попробуйте позже."
            )
        except Exception:
            logger.exception(f"Error checking criterion: {criterion}")
            return CriterionCheckResult(
                criterion=criterion, passed=False, comment="Ошибка при проверке критерия. Попробуйте позже."
            )

    def check_all_criteria(self, criteria: list[str], task_text: str) -> list[CriterionCheckResult]:
        """Check all criteria against task text."""
        results = []

        for criterion in criteria:
            result = self.check_criterion(criterion, task_text)
            results.append(result)

        return results
