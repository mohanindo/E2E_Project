# Task Manager Frontend

This React/Vite frontend connects directly to all five endpoints in the FastAPI application.

It supports creating a task, reading all tasks, finding one task by ID, updating a task, and deleting a task.

## Run the backend

From the project root:

```powershell
venv\Scripts\Activate.ps1
fastapi dev app/main.py
```

FastAPI should run at `http://127.0.0.1:8000`.

## Run the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Connection

The frontend calls `http://127.0.0.1:8000` directly. The FastAPI application allows the development origins `http://localhost:3000` and `http://127.0.0.1:3000` through `CORSMiddleware`.
