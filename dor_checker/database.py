import logging
import sqlite3
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

DATABASE_PATH = Path("dor_checker.db")


def get_db_connection() -> sqlite3.Connection:
    """Get a database connection with row factory enabled."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_database() -> None:
    """Initialize the database with required tables."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()

        # Create dor_templates table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS dor_templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Create dor_criteria table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS dor_criteria (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                dor_id INTEGER NOT NULL,
                criterion TEXT NOT NULL,
                order_index INTEGER DEFAULT 0,
                FOREIGN KEY (dor_id) REFERENCES dor_templates(id) ON DELETE CASCADE
            )
        """)

        # Create index for faster criterion lookups
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_dor_criteria ON dor_criteria(dor_id)
        """)

        conn.commit()
        logger.info("Database initialized successfully")

    except Exception:
        logger.exception("Error initializing database")
        conn.rollback()
        raise
    finally:
        conn.close()


def create_dor(name: str, description: str, criteria: list[str]) -> int:
    """Create a new DoR template with criteria."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()

        # Insert DoR template
        cursor.execute("INSERT INTO dor_templates (name, description) VALUES (?, ?)", (name, description))
        dor_id = cursor.lastrowid
        if dor_id is None:
            raise RuntimeError("Failed to get last row ID")

        # Insert criteria
        for order_index, criterion in enumerate(criteria):
            cursor.execute(
                "INSERT INTO dor_criteria (dor_id, criterion, order_index) VALUES (?, ?, ?)",
                (dor_id, criterion, order_index),
            )

        conn.commit()
        logger.info(f"Created DoR template with id {dor_id}")
        return dor_id

    except Exception:
        logger.exception("Error creating DoR template")
        conn.rollback()
        raise
    finally:
        conn.close()


def get_all_dors() -> list[dict[str, Any]]:
    """Get all DoR templates with criteria count."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                dt.id,
                dt.name,
                dt.description,
                COUNT(dc.id) as criteria_count,
                dt.created_at
            FROM dor_templates dt
            LEFT JOIN dor_criteria dc ON dt.id = dc.dor_id
            GROUP BY dt.id, dt.name, dt.description, dt.created_at
            ORDER BY dt.created_at DESC
        """)

        rows = cursor.fetchall()
        return [dict(row) for row in rows]

    except Exception:
        logger.exception("Error fetching DoR templates")
        raise
    finally:
        conn.close()


def get_dor_by_id(dor_id: int) -> dict[str, Any] | None:
    """Get a DoR template by ID with all criteria."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()

        # Get DoR template
        cursor.execute("SELECT * FROM dor_templates WHERE id = ?", (dor_id,))
        dor_row = cursor.fetchone()

        if not dor_row:
            return None

        # Get criteria
        cursor.execute("SELECT * FROM dor_criteria WHERE dor_id = ? ORDER BY order_index", (dor_id,))
        criteria_rows = cursor.fetchall()

        dor_dict = dict(dor_row)
        dor_dict["criteria"] = [dict(row) for row in criteria_rows]

        return dor_dict

    except Exception:
        logger.exception(f"Error fetching DoR template {dor_id}")
        raise
    finally:
        conn.close()


def update_dor(dor_id: int, name: str, description: str, criteria: list[str]) -> bool:
    """Update a DoR template and its criteria."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()

        # Check if DoR exists
        cursor.execute("SELECT id FROM dor_templates WHERE id = ?", (dor_id,))
        if not cursor.fetchone():
            return False

        # Update DoR template
        cursor.execute(
            "UPDATE dor_templates SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            (name, description, dor_id),
        )

        # Delete existing criteria
        cursor.execute("DELETE FROM dor_criteria WHERE dor_id = ?", (dor_id,))

        # Insert new criteria
        for order_index, criterion in enumerate(criteria):
            cursor.execute(
                "INSERT INTO dor_criteria (dor_id, criterion, order_index) VALUES (?, ?, ?)",
                (dor_id, criterion, order_index),
            )

        conn.commit()
        logger.info(f"Updated DoR template {dor_id}")
        return True

    except Exception:
        logger.exception(f"Error updating DoR template {dor_id}")
        conn.rollback()
        raise
    finally:
        conn.close()


def delete_dor(dor_id: int) -> bool:
    """Delete a DoR template and its criteria."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()

        # Check if DoR exists
        cursor.execute("SELECT id FROM dor_templates WHERE id = ?", (dor_id,))
        if not cursor.fetchone():
            return False

        # Delete DoR template (criteria will be deleted by CASCADE)
        cursor.execute("DELETE FROM dor_templates WHERE id = ?", (dor_id,))

        conn.commit()
        logger.info(f"Deleted DoR template {dor_id}")
        return True

    except Exception:
        logger.exception(f"Error deleting DoR template {dor_id}")
        conn.rollback()
        raise
    finally:
        conn.close()


def create_default_dors() -> None:
    """Create default DoR templates if none exist."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM dor_templates")
        count = cursor.fetchone()[0]

        if count > 0:
            logger.info("DoR templates already exist, skipping default creation")
            return

        default_dors = [
            {
                "name": "General Task DoR",
                "description": "Базовый DoR для общих задач",
                "criteria": [
                    "Задача содержит четкое описание проблемы или функционала",
                    "Указаны acceptance criteria (критерии приемки)",
                    "Есть оценка времени выполнения",
                    "Определены зависимости от других задач",
                    "Указан приоритет задачи",
                ],
            },
            {
                "name": "Backend Task DoR",
                "description": "Стандартный DoR для backend задач",
                "criteria": [
                    "Задача содержит четкое описание проблемы или функционала",
                    "Указаны acceptance criteria (критерии приемки)",
                    "Есть оценка времени выполнения",
                    "Описаны API endpoints (если применимо)",
                    "Указаны зависимости от других задач или сервисов",
                    "Определена структура базы данных (если применимо)",
                    "Описаны требования к безопасности",
                ],
            },
            {
                "name": "Frontend Task DoR",
                "description": "DoR для frontend задач",
                "criteria": [
                    "Задача содержит четкое описание UI/UX требований",
                    "Есть mockups или wireframes",
                    "Указаны acceptance criteria (критерии приемки)",
                    "Определены поддерживаемые браузеры/устройства",
                    "Есть оценка времени выполнения",
                    "Описаны интеграции с API",
                    "Определены требования к доступности",
                ],
            },
            {
                "name": "Bug Fix DoR",
                "description": "DoR для исправления багов",
                "criteria": [
                    "Описаны шаги для воспроизведения бага",
                    "Указано ожидаемое и фактическое поведение",
                    "Определена критичность бага",
                    "Есть информация об окружении где проявляется баг",
                    "Указана оценка времени на исправление",
                ],
            },
        ]

        for dor_data in default_dors:
            create_dor(dor_data["name"], dor_data["description"], dor_data["criteria"])  # type: ignore

        logger.info("Created default DoR templates")

    except Exception:
        logger.exception("Error creating default DoR templates")
        raise
    finally:
        conn.close()
