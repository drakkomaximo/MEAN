# Task Manager Frontend (MEAN Stack)

## Overview

This is the frontend for the Task Manager application, built with Angular and Angular Material. It provides a modern, responsive UI for managing tasks, including advanced features such as filtering, history tracking, and dynamic tag management.

---

## Features

- View, create, edit, and delete tasks
- Filter tasks by status, priority, tags, and due date range
- Responsive design: table view on desktop, card view on mobile
- Task history: view all changes made to a task
- Dynamic tag input and autocomplete
- Pagination and sorting
- Confirmation dialogs for destructive actions

---

## Folder Structure

```
frontend/
  src/
    app/
      components/
        task-list/      # Task list table and filters
        task-form/      # Task creation/edit form
        task-history/   # Task change history view
      services/
        task.ts         # Task API service
      models/
        task.ts         # Task and TaskHistory interfaces
      ... (app config, routes, etc)
```

---

## Main Components

- **TaskListComponent** (`components/task-list/`)
  - Displays all tasks in a table (desktop) or cards (mobile)
  - Filtering, pagination, and actions (edit, delete, view history)
- **TaskFormComponent** (`components/task-form/`)
  - Form for creating and editing tasks
  - Dynamic tag input, validation, and date picker
- **TaskHistoryComponent** (`components/task-history/`)
  - Shows the change history for a selected task

## Services

- **TaskService** (`services/task.ts`)
  - Handles all API requests to the backend for tasks, options, and history

## Models

- **Task** (`models/task.ts`)
  - Interface for task objects
- **TaskHistory** (`models/task.ts`)
  - Interface for task history records

## Utilities

- **Responsive UI**: Uses Angular Material and custom CSS for adaptive layouts
- **Debounced Filtering**: Tag filter input uses a 1s debounce to reduce API calls

---

## How to Run Locally

1. Go to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   ng serve
   ```
4. Open your browser at `http://localhost:4200`

---

## Notes

- The frontend expects the backend API to be running (see backend/README.md for details).
- All UI text and messages are in English.
- For development/testing, you can use the backend's `/api/tasks/seed` endpoint to populate the database with mock data.

---

## License
MIT
