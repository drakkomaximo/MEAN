# Task Manager Backend (MEAN Stack)

## Overview

This is the backend for the Task Manager application, built with Node.js, Express, TypeScript, and MongoDB (Mongoose).

---

## ⚠️ Security Note

> **Important:** The real environment variable values are included below ONLY because this project is a public technical test. In a real-world project, these secrets should NEVER be committed to the repository or shared publicly. Always use a `.env` file (which should be in `.gitignore`) and set secrets securely in your deployment platform.

---

## Environment Variables (for public test)

```
PORT=3000
DB_USER=drakkoAAAMB
DB_PASSWORD=2LdwWCCImzs4KrGIE
DB_HOST=cluster0.umm8t4f.mongodb.net
DB_NAME=task-manager
DB_REWRITE=retryWrites=true&w=majority
NODE_ENV=development
```

---

## How to Run Locally

1. Clone the repository.
2. Go to the `backend` folder:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file with the content above (for local development, use `PORT=3000`).
5. Start the development server:
   ```bash
   npm run dev
   ```
6. The API will be available at `http://localhost:3000`.

## How to Deploy on Render

1. Push your project (including both frontend and backend) to GitHub.
2. Go to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub and select your repository.
4. In the **Root Directory** field, enter:
   ```
   backend
   ```
5. Set the **Build Command** to:
   ```
   npm install && npm run build
   ```
6. Set the **Start Command** to:
   ```
   npm start
   ```
7. Add the environment variables above in the Render dashboard. **Note:** Render will set the `PORT` variable automatically in production; you do not need to set it manually.
8. Click **Create Web Service** and wait for the build and deploy to finish.
9. Your backend will be available at the public URL provided by Render:
   ```
   https://backend-aaamb.onrender.com/
   ```

## API Documentation

Once deployed, you can access the Swagger UI at:
```
https://backend-aaamb.onrender.com/api-docs
```

## Main Endpoints

- `POST https://backend-aaamb.onrender.com/api/tasks` - Create a new task
- `GET https://backend-aaamb.onrender.com/api/tasks` - List all tasks (with filters)
- `GET https://backend-aaamb.onrender.com/api/tasks/:id` - Get a task by ID
- `PATCH https://backend-aaamb.onrender.com/api/tasks/:id` - Update a task
- `DELETE https://backend-aaamb.onrender.com/api/tasks/:id` - Delete a task
- `GET https://backend-aaamb.onrender.com/api/tasks/:id/history` - Get task change history
- `GET https://backend-aaamb.onrender.com/api/tasks/status/options` - Get allowed status values
- `GET https://backend-aaamb.onrender.com/api/tasks/priority/options` - Get allowed priority values
- `POST https://backend-aaamb.onrender.com/api/tasks/seed` - Seed the database with 25 mock tasks (only if the database is empty)

## Seeding the Database with Mock Data

You can populate the database with 25 mock tasks for testing purposes using the seed endpoint:

```
POST /api/tasks/seed
```
- This will only work if the database is empty. If there are existing tasks, the endpoint will return an error.
- Each mock task will have random status, priority, due date, and tags.

**Example using curl:**
```bash
curl -X POST http://localhost:3000/api/tasks/seed
```

**Note:** This endpoint is intended for development/testing only.

## Notes

- Make sure your MongoDB Atlas cluster allows connections from Render's IPs (you can use `0.0.0.0/0` for testing).
- All environment variables must be set in the Render dashboard for production.
- Depending on the environment (local or production), the API base URL changes:
  - Local: http://localhost:3000
  - Production: https://backend-aaamb.onrender.com

## License
MIT 