# Python Project Template for Cursor

Welcome to this Python project template adapted for use with the Cursor editor. This template provides a structured starting point for your Python applications with modern tooling and best practices built in.

## 🚀 Getting Started

### Prerequisites

This template requires:

- [UV](https://github.com/astral-sh/uv) for dependency management
- [just](https://github.com/casey/just) command runner
- https://marketplace.visualstudio.com/items?itemName=ms-python.python

### Quick Setup

1. Clone this repository
2. Run the setup script to customize the template for your project:
   ```bash
   ./project_setup.py "Your Project Name"
   ```
   This script will:
   - Rename the `you_app_srcs` directory to your project name (in snake_case)
   - Update project name in `pyproject.toml`
   - Update package references in all necessary files
   - Update module name in `__init__.py`

3. Install dependencies:
   ```bash
   just init-venv
   just update-deps
   ```
4. Start developing!

## 📁 Template Structure

```
.
├── pyproject.toml         # Project configuration and dependencies
├── justfile               # Command runner tasks
├── project_setup.py       # Project customization script
├── you_app_srcs/          # Main source directory (will be renamed by setup script)
│   ├── __init__.py        # Package initialization
│   └── ...                # Your modules go here
└── CHANGELOG.md           # Documentation of changes
```

## 🛠️ Development Commands

This template uses `just` for command running:

- `just fmt` - Format code
- `just lint` - Lint code
- `just update-deps` - Update dependencies

## 🔄 Customization

The template includes a customization script for easy project setup:

```bash
# Example: Set up a project called "Weather Service"
./project_setup.py "Weather Service"
```

This will:
- Rename the package directory to `weather_service`
- Update project name to "WEATHER-SERVICE" in pyproject.toml
- Update all internal references to use the new package name

## 📝 Development Guidelines

This template encourages:

- Composition over inheritance
- Type hints for everything (checked by mypy)
- Comprehensive documentation
- Proper logging practices
- Modern Python features
