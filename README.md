# Task Manager - Full Stack Application

A corporate-grade task management system with role-based access control (RBAC) built with Next.js, MySQL, Prisma, and custom JWT authentication.

## Features

- **Authentication**: Secure login/signup with JWT tokens and HTTP-only cookies
- **Role-Based Access Control**:
  - **Admin (Scrum Master)**: Full control - create, edit, delete projects and tasks, assign tasks, view all tasks
  - **Member (Developer)**: Limited access - edit assigned tasks, update status, log hours, cannot create/delete
- **Project Management**: Create and organize projects with team members
- **Task Management**: 
  - Create, edit, and delete tasks (Admin only)
  - Assign tasks to team members
  - Track task status: Unassigned, Pending, In Progress, Completed
  - Set priority levels: Low, Medium, High
  - Estimated and actual hours tracking
- **Hours Logging**: Team members can log hours worked on tasks
- **Corporate Dashboard**: Clean, professional UI with dark theme

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: Custom JWT with bcrypt password hashing
- **Deployment**: Railway

## Project Structure

```
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ api/                 # API routes
â”‚   â”‚   â”œâ”€â”€ auth/           # Authentication endpoints
â”‚   â”‚   â”œâ”€â”€ tasks/          # Task management endpoints
â”‚   â”‚   â”œâ”€â”€ task-logs/      # Hour logging endpoints
â”‚   â”‚   â”œâ”€â”€ projects/       # Project management endpoints
â”‚   â”‚   â””â”€â”€ users/          # User endpoints
â”‚   â”œâ”€â”€ dashboard/          # Main dashboard page
â”‚   â”œâ”€â”€ login/              # Login page
â”‚   â”œâ”€â”€ signup/             # Signup page
â”‚   â””â”€â”€ layout.tsx          # Root layout
â”œâ”€â”€ components/
â”‚   â””â”€â”€ dashboard/          # Dashboard components
â”‚       â”œâ”€â”€ DashboardHeader.tsx
â”‚       â”œâ”€â”€ ProjectSelector.tsx
â”‚       â”œâ”€â”€ TaskList.tsx
â”‚       â”œâ”€â”€ TaskCard.tsx
â”‚       â”œâ”€â”€ CreateTaskDialog.tsx
â”‚       â”œâ”€â”€ EditTaskDialog.tsx
â”‚       â”œâ”€â”€ LogHoursDialog.tsx
â”‚       â””â”€â”€ CreateProjectDialog.tsx
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ auth.ts            # Authentication utilities
â”‚   â””â”€â”€ prisma.ts          # Prisma client
â”œâ”€â”€ prisma/
â”‚   â””â”€â”€ schema.prisma      # Database schema
â””â”€â”€ scripts/
    â””â”€â”€ setup-db.ts        # Database setup script
```

## Getting Started

### Prerequisites

- Node.js 16+ and pnpm/npm/yarn
- MySQL 8.0+ or MariaDB
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd task-manager
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="mysql://root:password@localhost:3306/task_manager"

   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

   # Environment
   NODE_ENV="development"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

4. **Set up the database**
   
   ```bash
   # Create the database schema
   pnpm db:push

   # Populate sample data
   pnpm db:setup
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

After running `pnpm db:setup`, you can log in with:

**Admin Account (Scrum Master)**
- Email: `admin@taskmanager.com`
- Password: `admin123`

**Developer Account**
- Email: `dev@taskmanager.com`
- Password: `dev123`

## Database Schema

### Users Table
- `id`: Primary key
- `email`: Unique email address
- `password`: Hashed password
- `name`: User's full name
- `role`: ADMIN or MEMBER
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Projects Table
- `id`: Primary key
- `name`: Project name
- `description`: Project description
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### ProjectMembers Table
- `id`: Primary key
- `userId`: Foreign key to users
- `projectId`: Foreign key to projects
- `role`: User's role in the project

### Tasks Table
- `id`: Primary key
- `title`: Task title
- `description`: Task description
- `status`: UNASSIGNED, PENDING, IN_PROGRESS, or COMPLETED
- `priority`: LOW, MEDIUM, or HIGH
- `projectId`: Foreign key to projects
- `assignedTo`: Foreign key to users (nullable)
- `estimatedHours`: Estimated hours for completion
- `actualHours`: Actual hours logged
- `dueDate`: Due date (nullable)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### TaskLogs Table
- `id`: Primary key
- `taskId`: Foreign key to tasks
- `userId`: Foreign key to users
- `hoursWorked`: Hours logged in this entry
- `notes`: Work notes (nullable)
- `createdAt`: Creation timestamp

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Logout (clears cookie)
- `GET /api/auth/me` - Get current logged-in user

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
  - Query params: `projectId`, `status`
- `POST /api/tasks` - Create task (Admin only)
- `GET /api/tasks/[id]` - Get single task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task (Admin only)

### Task Logs
- `GET /api/task-logs` - Get task logs
  - Query param: `taskId`
- `POST /api/task-logs` - Log hours (for assigned tasks)

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create project (Admin only)

### Users
- `GET /api/users` - Get all users

## Deployment to Railway

Railway is a simple cloud platform for deploying full-stack applications. Follow these steps:

### Step 1: Prepare Your Application

1. Ensure your code is pushed to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Update environment variables in your `.env.local`:
   - Change `JWT_SECRET` to a strong random string
   - Use the Railway MySQL database URL

### Step 2: Deploy to Railway

1. **Visit [Railway.app](https://railway.app)**
   - Sign up with GitHub account

2. **Create a new project**
   - Click "Create New Project"
   - Select "Deploy from GitHub repo"

3. **Connect GitHub**
   - Authorize Railway to access your GitHub account
   - Select your task-manager repository

4. **Add MySQL Database**
   - In Railway dashboard, click "Add Service"
   - Select "MySQL"
   - Railway creates a MySQL instance automatically

5. **Configure Environment Variables**
   - In the Railway project dashboard, go to "Variables"
   - Add the following:
     ```
     DATABASE_URL: (Railway auto-fills this)
     JWT_SECRET: your-strong-secret-key
     NODE_ENV: production
     NEXT_PUBLIC_API_URL: your-railway-url.railway.app
     ```

6. **Deploy**
   - Railway automatically deploys when you push to GitHub
   - Deployments take 2-5 minutes

7. **Setup Database**
   - SSH into Railway environment or use the database URL directly
   - Run migrations: `pnpm db:push`
   - Populate sample data: `pnpm db:setup`

### Alternative: Using Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Link to project
railway link

# Set environment variables
railway variables set DATABASE_URL="mysql://..."
railway variables set JWT_SECRET="your-secret"

# Deploy
railway up

# Run setup
railway run pnpm db:setup
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@host:3306/db` |
| `JWT_SECRET` | Secret key for JWT signing | `super-secret-random-key` |
| `NODE_ENV` | Environment (development/production) | `production` |
| `NEXT_PUBLIC_API_URL` | Frontend API base URL | `https://app.railway.app` |

## Security Features

- **Password Security**: Passwords are hashed with bcrypt (10 salt rounds)
- **JWT Authentication**: Tokens expire after 7 days
- **HTTP-Only Cookies**: Auth tokens stored in secure HTTP-only cookies
- **Role-Based Access Control**: API validates user role for each endpoint
- **Input Validation**: All inputs are validated before database operations
- **CORS Ready**: API can be extended with CORS support

## Performance Optimizations

- Server-side authentication with cookies (no localStorage)
- Efficient database queries with Prisma
- Selective field queries to minimize payload
- Proper indexing on frequently queried columns
- Next.js automatic code splitting and optimization

## Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Task comments and activity logs
- [ ] Advanced filtering and search
- [ ] Team reports and analytics
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Dark/Light theme toggle
- [ ] Mobile app with React Native

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED
```
- Check if MySQL is running: `mysql -u root -p`
- Verify DATABASE_URL in `.env.local`
- Ensure MySQL user has proper permissions

### JWT Token Error
```
Error: jwt expired
```
- Clear cookies in browser DevTools
- Login again to get a new token
- Check JWT_SECRET is correct

### Build Errors
```
Error: Module not found
```
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Regenerate Prisma client: `pnpm prisma:generate`

## Support & Contribution

For issues and feature requests, please open an issue on GitHub.

## License

MIT

