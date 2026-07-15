# CLI CRUD Task Manager

A beginner-friendly Python command-line application for practicing CRUD operations before learning how to expose the same operations through FastAPI.

## What is CRUD?

#
CRUD represents the four basic operations used in most applications:

- **Create**: Add a new task.
- **Read**: View all tasks or one task by its ID.
- **Update**: Change an existing task.
- **Delete**: Remove a task.

## Requirements

- Python 3.8 or newer
- No external packages are required

## Run the application

Open PowerShell in the project directory and run:

```powershell
python crud_cli.py
```

You will see this menu:

```text
=== Task Manager CRUD ===
1. Create task
2. Read all tasks
3. Read one task
4. Update task
5. Delete task
0. Exit
```

Enter a menu number and follow the prompts.

## Project structure

```text
Fast_API/
|-- crud_cli.py   # Application code
`-- README.md     # Project instructions
```

## How the code is organized

The `TaskManager` class contains the main application logic:

| Method | CRUD operation | Purpose |
|---|---|---|
| `create_task()` | Create | Creates and returns a new task |
| `get_all_tasks()` | Read | Returns every task |
| `get_task()` | Read | Finds one task by ID |
| `update_task()` | Update | Changes an existing task |
| `delete_task()` | Delete | Removes a task |

The functions ending in `_cli` handle command-line input and output. Keeping this separate from `TaskManager` will make it easier to reuse the CRUD logic with FastAPI later.

## Task format

Each task looks like this:

```python
{
    "id": 1,
    "title": "Learn FastAPI",
    "description": "Practice CRUD routes",
    "completed": False,
}
```

## Important note

The application stores tasks in memory. All tasks are removed when the program stops. This keeps the first exercise simple; a later version can use SQLite or another database.

## Future FastAPI mapping

When you are ready to add FastAPI, the current operations can map to endpoints like these:

| Current operation | HTTP method | Future endpoint |
|---|---|---|
| Create a task | `POST` | `/tasks` |
| Read all tasks | `GET` | `/tasks` |
| Read one task | `GET` | `/tasks/{task_id}` |
| Update a task | `PUT` | `/tasks/{task_id}` |
| Delete a task | `DELETE` | `/tasks/{task_id}` |

The current project intentionally contains no API code, so you can practice implementing these routes yourself.
