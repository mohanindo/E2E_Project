"""A simple in-memory CRUD application for practicing before FastAPI.

Run it with:
    python crud_cli.py

Later, the functions in TaskManager can be called from FastAPI route functions.
"""


class TaskManager:
    """Stores tasks in memory and provides CRUD operations."""

    def __init__(self):
        self.tasks = {}
        self.next_id = 1

    def create_task(self, title, description):
        task = {
            "id": self.next_id,
            "title": title,
            "description": description,
            "completed": False,
        }
        self.tasks[self.next_id] = task
        self.next_id += 1
        return task

    def get_all_tasks(self):
        return list(self.tasks.values())

    def get_task(self, task_id):
        return self.tasks.get(task_id)

    def update_task(self, task_id, title, description, completed):
        task = self.get_task(task_id)
        if task is None:
            return None

        task["title"] = title
        task["description"] = description
        task["completed"] = completed
        return task

    def delete_task(self, task_id):
        return self.tasks.pop(task_id, None)


def print_task(task):
    status = "Completed" if task["completed"] else "Pending"
    print(f"\nID: {task['id']}")
    print(f"Title: {task['title']}")
    print(f"Description: {task['description'] or '-'}")
    print(f"Status: {status}")


def read_task_id():
    try:
        return int(input("Enter task ID: ").strip())
    except ValueError:
        print("Task ID must be a number.")
        return None


def read_title(prompt="Enter title: "):
    while True:
        title = input(prompt).strip()
        if title:
            return title
        print("Title cannot be empty.")


def create_task_cli(manager):
    title = read_title()
    description = input("Enter description: ").strip()
    task = manager.create_task(title, description)
    print(f"Task {task['id']} created successfully.")


def list_tasks_cli(manager):
    tasks = manager.get_all_tasks()
    if not tasks:
        print("No tasks found.")
        return

    for task in tasks:
        print_task(task)


def get_task_cli(manager):
    task_id = read_task_id()
    if task_id is None:
        return

    task = manager.get_task(task_id)
    if task is None:
        print("Task not found.")
        return

    print_task(task)


def update_task_cli(manager):
    task_id = read_task_id()
    if task_id is None:
        return

    task = manager.get_task(task_id)
    if task is None:
        print("Task not found.")
        return

    print("Press Enter to keep the current value.")
    title = input(f"Title [{task['title']}]: ").strip() or task["title"]
    description_input = input(f"Description [{task['description']}]: ").strip()
    description = description_input or task["description"]

    while True:
        current_status = "y" if task["completed"] else "n"
        completed_input = input(f"Completed? (y/n) [{current_status}]: ").strip().lower()
        if completed_input == "":
            completed = task["completed"]
            break
        if completed_input in ("y", "n"):
            completed = completed_input == "y"
            break
        print("Please enter y or n.")

    manager.update_task(task_id, title, description, completed)
    print("Task updated successfully.")


def delete_task_cli(manager):
    task_id = read_task_id()
    if task_id is None:
        return

    task = manager.get_task(task_id)
    if task is None:
        print("Task not found.")
        return

    confirm = input(f"Delete '{task['title']}'? (y/n): ").strip().lower()
    if confirm == "y":
        manager.delete_task(task_id)
        print("Task deleted successfully.")
    else:
        print("Delete cancelled.")


def show_menu():
    print("\n=== Task Manager CRUD ===")
    print("1. Create task")
    print("2. Read all tasks")
    print("3. Read one task")
    print("4. Update task")
    print("5. Delete task")
    print("0. Exit")


def main():
    manager = TaskManager()
    actions = {
        "1": create_task_cli,
        "2": list_tasks_cli,
        "3": get_task_cli,
        "4": update_task_cli,
        "5": delete_task_cli,
    }

    while True:
        show_menu()
        choice = input("Choose an option: ").strip()

        if choice == "0":
            print("Goodbye!")
            break

        action = actions.get(choice)
        if action is None:
            print("Invalid option. Choose a number from 0 to 5.")
            continue

        action(manager)


if __name__ == "__main__":
    main()
