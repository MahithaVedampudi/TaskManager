# Task Manager - Complete Installation & Deployment Guide

## Part 1: Local Development Setup

### Step 1: Prerequisites
You need to have these installed on your machine:
- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **pnpm** - Package manager
- **MySQL 8.0** - Database (OR Docker for easier setup)
- **Git** - Version control

### Step 2: Install pnpm (if not installed)
```bash
npm install -g pnpm
```

### Step 3: Set Up MySQL Database

Choose **ONE** option:

#### Option A: Using Docker (Recommended - Easiest)
```bash
# Install Docker from https://www.docker.com/

# Run MySQL in Docker
docker run --name task_manager_db \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=task_manager \
  -p 3306:3306 \
  -d mysql:8.0

# Verify it's running
docker ps | grep task_manager_db
```

#### Option B: Local MySQL Installation
```bash
# macOS (if you have Homebrew)
brew install mysql
brew services start mysql

# Linux (Ubuntu/Debian)
sudo apt-get install mysql-server
sudo service mysql start

# Windows
# Download and install from: https://dev.mysql.com/downloads/mysql/

# Then create database:
mysql -u root -p
# Enter password when prompted, then run:
> CREATE DATABASE task_manager;
> EXIT;
```

### Step 4: Clone or Download the Project
```bash
# If you have the code on GitHub:
git clone <your-repo-url>
cd task-manager

# OR if you downloaded the ZIP:
unzip task-manager.zip
cd task-manager
```

### Step 5: Update Environment Variables
Edit `.env.local` file in your project root:

```env
# Database Connection
DATABASE_URL="mysql://root:password@localhost:3306/task_manager"

# JWT Secret (change this to something secure)
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Environment
NODE_ENV="development"

# API URL
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**Important:**
- Replace `password` with your MySQL root password
- Replace `your-super-secret-jwt-key-change-this` with a unique secret
- For local dev, you can use any secret, but change it for production

### Step 6: Install Dependencies
```bash
cd /path/to/project
pnpm install
```

This will install all required packages (takes 2-3 minutes).

### Step 7: Initialize Database
```bash
# Generate Prisma client
pnpm prisma:generate

# Push schema to database
pnpm db:push

# Create sample data and test users
pnpm db:setup
```

**What this does:**
- Creates database tables
- Creates test accounts:
  - Admin: `admin@taskmanager.com` / `admin123`
  - Dev: `dev@taskmanager.com` / `dev123`
- Creates a sample project

### Step 8: Start Development Server
```bash
pnpm dev
```

This starts the development server on `http://localhost:3000`

### Step 9: Access the Application
1. Open your browser to `http://localhost:3000`
2. You'll be redirected to `/login`
3. Use one of the demo credentials:
   - **Admin Account:**
     - Email: `admin@taskmanager.com`
     - Password: `admin123`
   - **Developer Account:**
     - Email: `dev@taskmanager.com`
     - Password: `dev123`

### Step 10: Test Functionality

#### As Admin (admin@taskmanager.com):
1. Click "Create Project" button
2. Enter project name and description
3. Add team members (invite the dev account)
4. Click "Create Task" button
5. Fill in task details and assign to a team member
6. View task status and hours on dashboard

#### As Developer (dev@taskmanager.com):
1. View your assigned tasks
2. Click on a task to edit
3. Change status: Pending â†’ In Progress â†’ Completed
4. Click "Log Hours" to track time spent
5. Submit your hours

---

## Part 2: Railway Deployment (Live URL)

### Prerequisites for Railway
- GitHub account with your code pushed
- Railway.app account (free tier available)

### Step 1: Push Code to GitHub

#### If you don't have a GitHub repository:
```bash
git init
git add .
git commit -m "Task Manager Application"
git branch -M main

# Create a new repository on GitHub (https://github.com/new)
# Then:
git remote add origin https://github.com/YOUR_USERNAME/task-manager.git
git push -u origin main
```

#### If you already have a repository:
```bash
git add .
git commit -m "Task Manager Application"
git push origin main
```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "Start New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway with GitHub
5. Select your `task-manager` repository
6. Railway will auto-detect it's a Node.js project

### Step 3: Add MySQL Service

1. In Railway dashboard, click "Add"
2. Select "Database"
3. Choose "MySQL"
4. Railway will create a MySQL instance automatically
5. Note the `DATABASE_URL` that was created (you'll see it in Variables)

### Step 4: Configure Environment Variables

In your Railway project dashboard:

1. Click on your Node.js service
2. Go to "Variables" tab
3. Add these variables:

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-railway-domain.railway.app
JWT_SECRET=<generate-a-random-string>
```

**To generate JWT_SECRET:**
```bash
# On your local machine, run:
openssl rand -hex 32

# Copy the output and paste it into Railway's JWT_SECRET field
```

**To find your Railway domain:**
- In Railway dashboard, go to your Node.js service
- Look for "Domains" section at the top
- It will be something like: `task-manager-production.railway.app`
- Use this for `NEXT_PUBLIC_API_URL`

### Step 5: Check Build Logs

1. Click on your Node.js service
2. Go to "Build" tab
3. Watch the logs as it builds
4. Should complete in 2-3 minutes
5. You'll see "Deployment successful" when done

### Step 6: Access Your Live App

1. In Railway dashboard, find your domain
2. Click the domain link or copy it
3. Open in browser: `https://your-domain.railway.app`
4. You'll see the login page
5. Login with demo credentials (same as local)

### Step 7: Verify Everything Works

- Test login with both accounts
- Create a project as admin
- Create and assign a task
- Login as dev and check if you can edit the task
- Try logging hours as dev

---

## Troubleshooting

### Local Setup Issues

#### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:**
- Check MySQL is running: `docker ps` (for Docker)
- Verify DATABASE_URL in `.env.local` is correct
- Make sure database exists: `mysql -u root -p task_manager`

#### pnpm not found
```
Error: command not found: pnpm
```
**Solution:**
```bash
npm install -g pnpm
pnpm --version
```

#### Dependencies installation error
```
Error: Could not resolve dependencies
```
**Solution:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Login not working
- Clear browser cookies (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check JWT_SECRET is set in `.env.local`
- Check browser console for errors (F12)

#### Tasks not showing
- Make sure you're logged in as admin
- Run `pnpm db:setup` again to create sample data
- Check API endpoint: visit `http://localhost:3000/api/tasks` in browser

### Railway Deployment Issues

#### Deployment fails with build error
**Solution:**
1. Check build logs in Railway dashboard
2. Verify all environment variables are set
3. Make sure `.env.local` is in `.gitignore` (not committed)
4. Ensure your `package.json` has correct scripts

#### App crashes after deployment
**Solution:**
- Check Railway logs: Click service â†’ "View Logs"
- Make sure DATABASE_URL is correct (Railway adds it automatically)
- Verify JWT_SECRET matches what you set
- Check NEXT_PUBLIC_API_URL is your Railway domain

#### Can't connect to database on Railway
**Solution:**
- Ensure MySQL service is running in Railway
- Check DATABASE_URL in Variables
- Click MySQL service and verify "Status" shows "Active"
- Click Node.js service and verify it can "Connect" to MySQL

#### Login works locally but not on Railway
**Solution:**
- Check that JWT_SECRET is different on Railway vs local
- Verify NEXT_PUBLIC_API_URL points to Railway domain
- Clear browser cache and cookies
- Hard refresh (Ctrl+F5)

---

## Useful Commands

### Local Development
```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# View database in admin UI
pnpm prisma studio

# Generate Prisma client
pnpm prisma:generate

# Push schema changes to database
pnpm db:push

# Create fresh database
pnpm db:setup

# View application logs
# Check browser console (F12 â†’ Console tab)
```

### Database Operations
```bash
# Connect to local MySQL
mysql -u root -p task_manager

# View all tables
SHOW TABLES;

# View users
SELECT * FROM User;

# View projects
SELECT * FROM Project;

# View tasks
SELECT * FROM Task;
```

### Git Operations
```bash
# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin main

# View history
git log --oneline
```

---

## File Locations

### Important Files
- `.env.local` - Environment variables (local)
- `prisma/schema.prisma` - Database schema
- `app/api/` - API endpoints
- `app/dashboard/page.tsx` - Main dashboard
- `app/login/page.tsx` - Login page

### Configuration Files
- `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS theme
- `railway.toml` - Railway deployment config

---

## Security Checklist

Before deploying:
- [ ] Never commit `.env.local` to GitHub
- [ ] Generate strong JWT_SECRET for production
- [ ] Use unique password for MySQL
- [ ] Enable HTTPS (Railway handles this automatically)
- [ ] Keep dependencies updated
- [ ] Review API endpoints for security

---

## Support & Documentation

- **Quick Reference:** `START_HERE.txt`
- **Features Overview:** `FEATURES.md`
- **Complete Docs:** `README.md`
- **API Documentation:** `DOCUMENTATION.md`

---

## Next Steps

1. Complete local setup
2. Test with demo accounts
3. Familiarize yourself with the features
4. Deploy to Railway
5. Share live URL with your team
6. Customize branding/colors as needed

**You've got this! The app is production-ready.** ðŸš€

