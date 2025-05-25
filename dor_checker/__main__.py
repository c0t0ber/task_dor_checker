import logging
import os

import dotenv
import uvicorn

from dor_checker import __name__ as app_name
from dor_checker import __version__ as app_version

dotenv.load_dotenv()


def configure_logging() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")


def main() -> None:
    """Run the DoR Checker FastAPI application."""
    configure_logging()
    logger = logging.getLogger(__name__)

    logger.info(f"Starting {app_name} version {app_version}")

    # Check for OpenAI API key
    if not os.getenv("OPENAI_API_KEY"):
        logger.error("OPENAI_API_KEY environment variable is required")
        logger.info("Please set OPENAI_API_KEY in your .env file")
        return

    try:
        uvicorn.run("dor_checker.main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
    except Exception:
        logger.exception("Failed to start application")
        raise


if __name__ == "__main__":
    main()
