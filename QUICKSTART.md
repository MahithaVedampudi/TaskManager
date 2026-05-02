# Task Manager - Quick Start Guide

## What Was Built

A complete, production-ready task management system with:
- **Role-Based Access Control**: Scrum Masters (ADMIN) and Developers (MEMBER) with different permissions
- **Authentication**: Secure login/signup with JWT and HTTP-only cookies
- **Project Management**: Create projects and assign team members
- **Task Management**: Full CRUD operations with status tracking and priority levels
- **Hours Logging**: Team members can log work hours on assigned tasks
- **Corporate Dashboard**: Clean dark theme UI with task filters and overview cards
- **Database**: MySQL with Prisma ORM for type-safe queries
- **Deployment Ready**: Configured for Railway cloud deployment

---

## Local Development (5 minutes)

### 1. Setup MySQL Database

**Option A: Using Docker (Easiest)**
```bash
docker run --name task_manager_db \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=task_manager \
  -p 3306:3306 \
  -d mysql:8.0
```

**Option B: Using Local MySQL**
```bash
# Create database
mysql -u root -p
> CREATE DATABASE task_manager;
> CREATE USER 'root'@'localhost' IDENTIFIED BY 'password';
> GRANT ALL PRIVILEGES ON task_manager.* TO 'root'@'localhost';
```

### 2. Configure Environment
Create `.env.local` in the root:
```env
DATABASE_URL="mysql://root:password@localhost:3306/task_manager"
JWT_SECRET="your-development-secret-key-here"
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. Setup & Run
```bash
# Install dependencies
pnpm install

# Push schema to database
pnpm db:push

# Populate sample data
pnpm db:setup

# Start dev server
pnpm dev
```

### 4. Login & Test
- Open http://localhost:3000
- **Admin**: admin@taskmanager.com / admin123
- **Developer**: dev@taskmanager.com / dev123

---

## Deployment to Railway (10 minutes)

### 1. Prepare Code
```bash
git add .
git commit -m "Task Manager Application"
git push origin main
```

### 2. Deploy via Web (Easiest)
1. Visit https://railway.app
2. Sign up with GitHub
3. Click "Create New Project"
4. Select "Deploy from GitHub repo"
5. Choose your task-manager repository
6. Click "Add Service" and select "MySQL"

### 3. Configure Environment
In Railway dashboard, add variables:
```
DATABASE_URL=    (auto-filled by Railway from MySQL)
JWT_SECRET=      (generate: openssl rand -hex 32)
NODE_ENV=        production
NEXT_PUBLIC_API_URL=  your-project-name.railway.app
```

### 4. Verify Deployment
- Wait 3-5 minutes for build
- Visit your Railway project URL
- Test with demo credentials
- That's it! Your app is live

---

## Key Features to Test

### For Scrum Masters (Admin)
1. Create new projects
2. Add team members to projects
3. Create tasks with priority and hours
4. Assign tasks to developers
5. Edit/delete tasks
6. View all team tasks in dashboard

### For Developers (Members)
1. Login to dashboard
2. See tasks assigned to them
3. Update task status (Pending â†’ In Progress â†’ Completed)
4. Log hours worked on tasks
5. Cannot create, edit, or delete tasks

### Dashboard Overview
- **Unassigned**: Tasks not yet assigned (yellow)
- **Pending**: Assigned but not started (blue)
- **In Progress**: Currently being worked on (cyan)
- **Completed**: Finished tasks (green)

---

## Project Structure Summary

```
Task Manager/
â”œâ”€â”€ API Endpoints
â”‚   â”œâ”€â”€ /api/auth/       (login, signup, logout, me)
â”‚   â”œâ”€â”€ /api/tasks/      (CRUD operations + filters)
â”‚   â”œâ”€â”€ /api/task-logs/  (hour logging)
â”‚   â”œâ”€â”€ /api/projects/   (project management)
â”‚   â””â”€â”€ /api/users/      (user listing)
â”œâ”€â”€ Pages
â”‚   â”œâ”€â”€ /login           (authentication)
â”‚   â”œâ”€â”€ /signup          (account creation)
â”‚   â”œâ”€â”€ /dashboard       (main interface)
â”‚   â””â”€â”€ /                (redirect to dashboard)
â”œâ”€â”€ Components
â”‚   â”œâ”€â”€ Dashboard        (header, sidebar, task list)
â”‚   â”œâ”€â”€ Dialogs          (create/edit forms)
â”‚   â””â”€â”€ UI               (shadcn/ui components)
â”œâ”€â”€ Database
â”‚   â”œâ”€â”€ Users            (accounts & roles)
â”‚   â”œâ”€â”€ Projects         (teams & organization)
â”‚   â”œâ”€â”€ Tasks            (work items)
â”‚   â””â”€â”€ TaskLogs         (hour tracking)
â””â”€â”€ Auth
    â”œâ”€â”€ JWT tokens       (7-day expiry)
    â”œâ”€â”€ HTTP-only cookies (secure storage)
    â””â”€â”€ RBAC             (admin vs member)
```

---

## Important Notes

### Security
- Passwords hashed with bcrypt
- JWT tokens in secure HTTP-only cookies
- Role-based access enforced on API
- Never commit `.env.local` to Git

### Database
- Automatic schema generation with Prisma
- Sample data includes 2 test users and 1 project
- MySQL connection pooling for performance
- Migrations managed through `prisma db push`

### Customization
- Change colors in `app/globals.css`
- Modify roles and permissions in API endpoints
- Extend schema in `prisma/schema.prisma`
- Add new features in components or API routes

---

## Troubleshooting

**Can't connect to database?**
- Verify MySQL is running
- Check DATABASE_URL in .env.local
- Run `pnpm db:push` to ensure schema exists

**Login not working?**
- Clear browser cookies
- Check JWT_SECRET is set correctly
- Verify database has users table

**Deployment fails?**
- Check Railway build logs
- Ensure .env.local is NOT committed
- Verify MySQL service is running in Railway

**Tasks not showing?**
- Ensure you're logged in as admin to see all tasks
- Members only see assigned tasks
- Check project has been selected

---

## Next Steps

1. **Test Locally**: Run app locally with demo credentials
2. **Deploy**: Push to Railway using the guide above
3. **Invite Team**: Share live URL with team members
4. **Customize**: Modify colors, branding, and fields
5. **Scale**: Add more features like notifications, reports, etc.

---

## Support

- **README.md**: Full documentation
- **DEPLOYMENT.md**: Detailed Railway deployment guide
- **API Documentation**: Comments in each API route file

Enjoy your new Task Manager application! ðŸš€

