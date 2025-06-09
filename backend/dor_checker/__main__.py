import logging

import dotenv

from dor_checker import __name__ as app_name
from dor_checker import __version__ as app_version
from dor_checker.app import MyClass

dotenv.load_dotenv()


def configure_logging() -> None:
    logging.basicConfig(level=logging.INFO)

    # An example of how to suppress less severe log messages
    # logging.getLogger("httpx").setLevel(logging.WARNING)


def main() -> None:
    logging.info(f"Application {app_name} version {app_version} is starting...")

    try:
        MyClass()
    except Exception as e:
        logging.exception(f"An error occurred: {e}")
        raise e
    finally:
        logging.info("Application finished successfully")

    return None


if __name__ == "__main__":
    configure_logging()
    main()
