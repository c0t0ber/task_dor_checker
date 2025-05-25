#!/usr/bin/env python3
import shutil
from pathlib import Path
import sys


def update_file_content(file_path: Path, replacements: dict[str, str]) -> None:
    """Update file content by replacing old strings with new ones."""
    if not file_path.exists():
        print(f"Warning: {file_path} does not exist.")
        return

    content = file_path.read_text()
    for old_str, new_str in replacements.items():
        content = content.replace(old_str, new_str)
    
    file_path.write_text(content)
    print(f"Updated {file_path}")


def setup_project(project_name: str) -> None:
    """Setup project by renaming directory and updating files."""
    # Convert to lowercase with underscores for directory/package name
    package_name = project_name.lower().replace(" ", "_").replace("-", "_")
    
    # Convert to uppercase with dashes for project name in pyproject.toml
    project_name_toml = project_name.lower().replace(" ", "-")
    
    # Define paths
    root_dir = Path(__file__).parent
    old_package_dir = root_dir / "you_app_srcs"
    new_package_dir = root_dir / package_name
    
    # Rename the package directory
    if old_package_dir.exists():
        shutil.move(old_package_dir, new_package_dir)
        print(f"Renamed directory: you_app_srcs → {package_name}")
    
    # Update justfile
    justfile_path = root_dir / "justfile"
    update_file_content(
        justfile_path,
        {
            "you_app_srcs": package_name,
        }
    )
    
    # Update pyproject.toml
    pyproject_path = root_dir / "pyproject.toml"
    update_file_content(
        pyproject_path,
        {
            "YOU-APP-NAME-HERE": project_name_toml,
        }
    )
    
    # Update __init__.py
    init_path = new_package_dir / "__init__.py"
    update_file_content(
        init_path,
        {
            "you_app_name": package_name,
        }
    )
    
    # Update __main__.py
    main_path = new_package_dir / "__main__.py"
    update_file_content(
        main_path,
        {
            "you_app_srcs": package_name,
        }
    )
    
    print(f"\nProject successfully set up as '{project_name}'!")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python project_setup.py \"example-project\"")
        sys.exit(1)
    
    project_name = sys.argv[1]
    setup_project(project_name) 