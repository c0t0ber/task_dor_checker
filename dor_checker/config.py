import os
from pathlib import Path

# Database configuration
DATABASE_PATH = Path("dor_checker.db")

# OpenAI configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Application limits
MAX_TASK_LENGTH = 5000
MAX_CRITERIA_COUNT = 20
MAX_DOR_NAME_LENGTH = 200
MAX_DOR_DESCRIPTION_LENGTH = 1000
MAX_CRITERION_LENGTH = 500

# Server configuration
DEFAULT_HOST = "0.0.0.0"
DEFAULT_PORT = 8000
