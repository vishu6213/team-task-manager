# Team Task Manager

A complete, production-ready full-stack MERN application for managing team projects and tasks.

## Features

- **Authentication & Authorization**: Secure JWT-based auth with Role-Based Access Control (Admin/Member).
- **Project Management**: Admins can create and manage projects, assigning members to them.
- **Task Management**: Create, assign, update, and track tasks (Todo, In Progress, Completed).
- **Dashboard**: High-level overview of task statistics, including pending, completed, and overdue tasks.
- **Modern UI**: Built with React, Vite, and Tailwind CSS. Fully responsive, clean layout with modern cards and hover effects.

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router DOM
- Axios
- Context API
- React Hot Toast
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (JSON Web Tokens)
- bcryptjs

## Prerequisites

- Node.js (v18+)
- MongoDB connection string (Atlas or Local)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/vishu6213/team-task-manager.git
   cd team-task-manager
   ```

2. **Root Dependencies**
   Install dependencies for both client and server from the root:
   ```bash
   npm install
   ```

3. **Backend Setup**
   ```bash
   cd server
   # Create .env file with:
   # MONGO_URI=your_mongodb_connection_string
   # JWT_SECRET=your_secret_key
   ```

4. **Frontend Setup**
   ```bash
   cd client
   # (Optional) Create .env file for custom API URL
   # VITE_API_URL=http://localhost:5000/api
   ```

## Running Locally

You can run the whole app from the root directory:

```bash
# Start both server and client (if concurrently is installed) or run separately:
npm run dev --prefix server
npm run dev --prefix client
```

The frontend will be accessible at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Deployment

This application is optimized for **Vercel** (Frontend) and **Render/Railway** (Backend).

### Production Configuration
The application automatically detects its environment. When deployed on Vercel, it defaults to the production backend:
`https://team-task-manager-ag7w.onrender.com/api`

To override this, set the `VITE_API_URL` environment variable in your Vercel/Render dashboard.

### Environment Variables

#### Backend (`server/.env`)
- `PORT`: 5000
- `MONGO_URI`: Your MongoDB string
- `JWT_SECRET`: Your secret key
- `CLIENT_URL`: Your frontend URL (or `*` for all)
- `NODE_ENV`: production

#### Frontend (Vercel Settings)
- `VITE_API_URL`: Your deployed backend URL
