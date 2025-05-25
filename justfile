set dotenv-load

default:
    just --list

init-venv:
    uv venv -p 3.12

fmt:
    uv run ruff check --fix-only dor_checker
    uv run isort dor_checker
    uv run ruff format dor_checker

lint:
    uv run isort --check dor_checker
    uv run ruff format --check dor_checker
    uv run ruff check dor_checker
    uv run mypy dor_checker

update-deps:
    uv pip compile --no-header --upgrade pyproject.toml -o requirements.txt
    uv pip install -r requirements.txt
   

run-app:
    uv run python -m dor_checker

