set dotenv-load

default:
    just --list

init-venv:
    uv venv -p 3.12

fmt:
    uv run ruff check --fix-only you_app_srcs
    uv run isort you_app_srcs
    uv run ruff format you_app_srcs

lint:
    uv run isort --check you_app_srcs
    uv run ruff format --check you_app_srcs
    uv run ruff check you_app_srcs
    uv run mypy you_app_srcs

update-deps:
    uv pip compile --no-header --upgrade pyproject.toml -o requirements.txt
    uv pip install -r requirements.txt
   

run-app:
    uv run python -m you_app_srcs

