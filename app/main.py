from fastapi import FastAPI,Body,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.crud_cli import TaskManager

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

manager=TaskManager()

#----------------------------------
@app.post("/tasks",status_code=201)
def create_task_api(task:dict=Body(...)):
    title=task.get("title")
    description = task.get("description", "")
    return manager.create_task(title,description)

#-------------------------------------
@app.get("/read-all-tasks",status_code=200)
def read_all_tasks_api():
    return manager.get_all_tasks()
#----------------------------------------
@app.get("/read-one-task/{task_id}", status_code=200)
def read_one_task_api(task_id: int):
    task = manager.get_task(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task
#----------------------------------------------
@app.put("/update-task/{task_id}",status_code=200)
def update_task_api(task_id:int,updated_data:dict=Body(...)):
    existing_task=manager.get_task(task_id)
    if existing_task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )
    title=updated_data.get("title",existing_task["title"])
    description=updated_data.get("description",
                                 existing_task["description"],)
    completed=updated_data.get("completed",existing_task["completed"],)
    return manager.update_task(task_id,title,description,completed)
#------------------------------------------------------
@app.delete("/tasks/{task_id}", status_code=200)
def delete_task_api(task_id: int):
    task = manager.get_task(task_id)

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    manager.delete_task(task_id)

    return {
        "message": "Task deleted successfully",
        "deleted_task": task,
    }

#-----------------------------------------------------------
# run cmd : fastapi dev .\main.py

# npm run dev

# PS D:\Fast_API\frontend> npm run dev
