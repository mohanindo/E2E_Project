import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

async function getResponseData(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Request failed");
  }
  return data;
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [createForm, setCreateForm] = useState({ title: "", description: "" });
  const [readId, setReadId] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    id: "",
    title: "",
    description: "",
    completed: false,
  });
  const [deleteId, setDeleteId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function showMessage(text) {
    setError("");
    setMessage(text);
  }

  function showError(text) {
    setMessage("");
    setError(text);
  }

  // GET /read-all-tasks
  async function readAllTasks() {
    try {
      const response = await fetch(`${API_URL}/read-all-tasks`);
      setTasks(await getResponseData(response));
      setError("");
    } catch (requestError) {
      showError(requestError.message);
    }
  }

  useEffect(() => {
    readAllTasks();
  }, []);

  // POST /tasks
  async function createTask(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const task = await getResponseData(response);
      setCreateForm({ title: "", description: "" });
      showMessage(`Task created successfully. Task number: ${task.id}`);
      await readAllTasks();
    } catch (requestError) {
      showError(requestError.message);
    }
  }

  // GET /read-one-task/{task_id}
  async function readOneTask(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/read-one-task/${readId}`);
      const task = await getResponseData(response);
      setSelectedTask(task);
      showMessage(`Task number ${task.id} found.`);
    } catch (requestError) {
      setSelectedTask(null);
      showError(requestError.message);
    }
  }

  // PUT /update-task/{task_id}
  async function updateTask(event) {
    event.preventDefault();
    const taskId = Number(updateForm.id);

    if (!Number.isInteger(taskId) || taskId < 1) {
      showError("Enter a valid task number to update.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/update-task/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updateForm.title,
          description: updateForm.description,
          completed: updateForm.completed,
        }),
      });
      const task = await getResponseData(response);
      showMessage(`Task number ${task.id} updated successfully.`);
      setUpdateForm({ id: "", title: "", description: "", completed: false });
      if (selectedTask?.id === task.id) setSelectedTask(task);
      await readAllTasks();
    } catch (requestError) {
      showError(requestError.message);
    }
  }

  // DELETE /tasks/{task_id}
  async function deleteTask(event) {
    event.preventDefault();
    const taskId = Number(deleteId);

    if (!window.confirm(`Delete task number ${taskId}?`)) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });
      await getResponseData(response);
      setDeleteId("");
      if (selectedTask?.id === taskId) setSelectedTask(null);
      showMessage(`Task number ${taskId} deleted successfully.`);
      await readAllTasks();
    } catch (requestError) {
      showError(requestError.message);
    }
  }

  function chooseTaskToUpdate(task) {
    setUpdateForm({
      id: String(task.id),
      title: task.title,
      description: task.description,
      completed: task.completed,
    });
    showMessage(`Task number ${task.id} loaded into the update form.`);
    document.getElementById("update-task-section")?.scrollIntoView({ behavior: "smooth" });
  }

  function chooseTaskToDelete(task) {
    setDeleteId(String(task.id));
    showMessage(`Task number ${task.id} selected. Confirm it in the delete section.`);
    document.getElementById("delete-task-section")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="container">
      <header>
        <p className="eyebrow">FASTAPI + REACT</p>
        <h1>Task Manager CRUD</h1>
        <p className="subtitle">Frontend connected directly to your FastAPI endpoints.</p>
      </header>

      {(message || error) && (
        <div className={error ? "notice error" : "notice success"}>
          {error || message}
        </div>
      )}

      <section>
        <h2>1. Create task</h2>
        <form onSubmit={createTask}>
          <label>
            Title
            <input
              value={createForm.title}
              onChange={(event) => setCreateForm({ ...createForm, title: event.target.value })}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={createForm.description}
              onChange={(event) => setCreateForm({ ...createForm, description: event.target.value })}
            />
          </label>
          <button type="submit">Create task</button>
        </form>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <h2>2. Read all tasks</h2>
            <p>{tasks.length} task{tasks.length === 1 ? "" : "s"}</p>
          </div>
          <button className="secondary" onClick={readAllTasks}>Refresh</button>
        </div>
        {tasks.length === 0 ? (
          <p className="empty">No tasks found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>ID</th><th>Title</th><th>Description</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.title}</td>
                    <td>{task.description || "—"}</td>
                    <td>{task.completed ? "Completed" : "Pending"}</td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="secondary small" onClick={() => chooseTaskToUpdate(task)}>
                          Edit
                        </button>
                        <button type="button" className="danger small" onClick={() => chooseTaskToDelete(task)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2>3. Read one task</h2>
        <form className="id-form" onSubmit={readOneTask}>
          <label>
            Task number
            <input type="number" min="1" value={readId} onChange={(e) => setReadId(e.target.value)} required />
          </label>
          <button type="submit">Find task</button>
        </form>
        {selectedTask && (
          <div className="result">
            <strong>Task #{selectedTask.id}: {selectedTask.title}</strong>
            <p>{selectedTask.description || "No description"}</p>
            <p>Status: {selectedTask.completed ? "Completed" : "Pending"}</p>
          </div>
        )}
      </section>

      <section id="update-task-section">
        <h2>4. Update task</h2>
        <form onSubmit={updateTask}>
          <label>
            Task number
            <input type="number" min="1" value={updateForm.id} onChange={(e) => setUpdateForm({ ...updateForm, id: e.target.value })} required />
          </label>
          <label>
            New title
            <input value={updateForm.title} onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })} required />
          </label>
          <label>
            New description
            <textarea value={updateForm.description} onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })} />
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={updateForm.completed} onChange={(e) => setUpdateForm({ ...updateForm, completed: e.target.checked })} />
            Completed
          </label>
          <button type="submit">Update task</button>
        </form>
      </section>

      <section id="delete-task-section" className="delete-panel">
        <h2>5. Delete task</h2>
        <form className="id-form" onSubmit={deleteTask}>
          <label>
            Task number
            <input type="number" min="1" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} required />
          </label>
          <button className="danger" type="submit">Delete task</button>
        </form>
      </section>
    </main>
  );
}
