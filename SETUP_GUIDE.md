# Task Manager - Complete Setup Guide

## Step-by-Step Local Setup (10 minutes)

### Prerequisites
- Node.js 18+ installed
- Docker (optional - for MySQL) or MySQL 8.0+ running locally
- pnpm package manager

---

## Option 1: Setup with Docker (RECOMMENDED - Easiest)

### Step 1: Start MySQL with Docker
```bash
docker run --name task_manager_db \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=task_manager \
  -p 3306:3306 \
  -d mysql:8.0
```

**Verify it's running:**
```bash
docker ps | grep task_manager_db
```

### Step 2: Install Dependencies
```bash
cd /path/to/project
pnpm install
```

### Step 3: Setup Database Schema
```bash
# Push Prisma schema to MySQL
pnpm db:push

# Populate sample data (creates admin & dev users)
pnpm db:setup
```

### Step 4: Start Development Server
```bash
pnpm dev
```

Your app is now running at **http://localhost:3000**

---

## Option 2: Setup with Local MySQL

### Step 1: Create Database
```bash
# Connect to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE task_manager;
CREATE USER 'taskuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON task_manager.* TO 'taskuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 2: Update .env.local
```env
DATABASE_URL="mysql://taskuser:password@localhost:3306/task_manager"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Step 3: Install & Setup
```bash
pnpm install
pnpm db:push
pnpm db:setup
pnpm dev
```

---

## Testing the Application

### Access the App
Open your browser and go to: **http://localhost:3000**

You'll be redirected to the login page.

### Demo Credentials

**Option A: Scrum Master (Admin)**
```
Email:    admin@taskmanager.com
Password: admin123
```
Can: Create projects, create/edit/delete tasks, assign to team

**Option B: Developer (Member)**
```
Email:    dev@taskmanager.com
Password: dev123
```
Can: Edit assigned tasks, log hours, view dashboard

### Test Workflow

1. **Login as Admin** (admin@taskmanager.com / admin123)
   - Dashboard loads with sample project
   - Click "Create Task" button
   - Create a new task: "Add user authentication" 
   - Set priority to "High"
   - Assign to "dev@taskmanager.com"
   - Click "Create"

2. **Logout & Login as Developer** (dev@taskmanager.com / dev123)
   - See your assigned task
   - Click "Edit" to change status to "In Progress"
   - Click "Log Hours" to add 2 hours of work
   - Change status to "Completed"
   - Notice you cannot delete or create new tasks

3. **Login as Admin Again**
   - Verify task status changed
   - See hours logged by developer
   - Test editing/deleting tasks
   - Create a new project with "Add Project" button

---

## Troubleshooting

### Issue: "Cannot find module" or "ENOENT"
**Solution:** Delete node_modules and reinstall
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: MySQL Connection Error
**Solution:** Verify MySQL is running
```bash
# For Docker
docker ps | grep task_manager

# For Local MySQL
mysql -u root -p -e "SELECT 1"
```

### Issue: Prisma schema error
**Solution:** Reset the database
```bash
# Drop and recreate
pnpm db:push --force-reset
pnpm db:setup
```

### Issue: Login not working after setup
**Solution:** 
1. Clear browser cookies (F12 â†’ Application â†’ Cookies â†’ Delete all)
2. Hard refresh (Ctrl+Shift+R)
3. Try logging in again

### Issue: Tasks table empty
**Solution:** Ensure you ran setup script and are logged in as admin
```bash
pnpm db:setup
```

---

## File Structure Overview

```
project/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ api/
â”‚   â”‚   â”œâ”€â”€ auth/          (login, signup, logout, me)
â”‚   â”‚   â”œâ”€â”€ tasks/         (task CRUD + filtering)
â”‚   â”‚   â”œâ”€â”€ task-logs/     (hour tracking)
â”‚   â”‚   â”œâ”€â”€ projects/      (project management)
â”‚   â”‚   â””â”€â”€ users/         (user listing)
â”‚   â”œâ”€â”€ login/             (auth page)
â”‚   â”œâ”€â”€ signup/            (registration page)
â”‚   â”œâ”€â”€ dashboard/         (main UI)
â”‚   â”œâ”€â”€ globals.css        (theme colors)
â”‚   â””â”€â”€ layout.tsx         (root layout)
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ dashboard/         (dashboard components)
â”‚   â”‚   â”œâ”€â”€ TaskCard.tsx
â”‚   â”‚   â”œâ”€â”€ TaskList.tsx
â”‚   â”‚   â”œâ”€â”€ CreateTaskDialog.tsx
â”‚   â”‚   â”œâ”€â”€ EditTaskDialog.tsx
â”‚   â”‚   â””â”€â”€ LogHoursDialog.tsx
â”‚   â””â”€â”€ ui/                (shadcn/ui components)
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ prisma.ts          (database client)
â”‚   â””â”€â”€ auth.ts            (JWT utilities)
â”œâ”€â”€ prisma/
â”‚   â””â”€â”€ schema.prisma      (database schema)
â”œâ”€â”€ scripts/
â”‚   â””â”€â”€ setup-db.ts        (seed sample data)
â””â”€â”€ .env.local             (environment variables)
```

---

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@localhost:3306/db` |
| `JWT_SECRET` | Secret for signing JWT tokens | `your-super-secret-key` |
| `NODE_ENV` | Development or production | `development` |
| `NEXT_PUBLIC_API_URL` | Frontend API base URL | `http://localhost:3000` |

---

## Next Steps After Setup

### 1. Customize the Application
- Change colors in `app/globals.css`
- Modify roles/permissions in API routes
- Add new fields to database in `prisma/schema.prisma`

### 2. Deploy to Railway
Follow the deployment guide in `DEPLOYMENT.md`

### 3. Add More Features
- Email notifications
- Task comments/discussions
- Time tracking reports
- Dashboard analytics
- Mobile app

---

## Quick Commands Reference

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:push          # Sync schema to database
pnpm db:setup         # Populate sample data
pnpm prisma:migrate   # Create a new migration
pnpm prisma:generate  # Generate Prisma client

# Lint
pnpm lint             # Check for linting errors
```

---

## Getting Help

If you encounter issues:

1. **Check the logs** - Terminal shows detailed error messages
2. **Review README.md** - Full project documentation
3. **Check DEPLOYMENT.md** - Railway deployment guide
4. **Inspect API files** - Each API route has detailed comments

---

## Security Notes

âš ï¸ **Important for Production:**
- Change `JWT_SECRET` to a strong random value
- Use environment variables from Railway, never hardcode
- Enable HTTPS in production
- Set secure cookie flags in `lib/auth.ts`
- Add rate limiting to API endpoints
- Implement CORS properly for frontend domain

---

## Docker Commands (if using Docker)

```bash
# Start MySQL container
docker run --name task_manager_db -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=task_manager -p 3306:3306 -d mysql:8.0

# View logs
docker logs task_manager_db

# Stop container
docker stop task_manager_db

# Start stopped container
docker start task_manager_db

# Remove container
docker rm task_manager_db
```

---

**You're all set! Your Task Manager is ready to use. Start with `pnpm dev` and login with the demo credentials above.**

