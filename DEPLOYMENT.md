# Railway Deployment Guide

This guide will walk you through deploying the Task Manager application to Railway, a modern cloud platform that makes deployment simple.

## Prerequisites

- GitHub account with your repository pushed
- Railway account (sign up at https://railway.app)
- A MySQL database (Railway provides this for free)

## Quick Deploy Steps

### Option 1: Using Railway Web Dashboard (Easiest)

1. **Sign in to Railway**
   - Go to https://railway.app
   - Click "Sign up" and authenticate with GitHub

2. **Create a New Project**
   - Click "Create New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub repositories
   - Select your `task-manager` repository
   - Choose the `main` branch

3. **Add MySQL Database**
   - In the Railway dashboard, click "+ Add Service"
   - Scroll down and click "MySQL"
   - Railway automatically creates and connects a MySQL instance

4. **Configure Environment Variables**
   - Go to "Variables" tab in Railway dashboard
   - Railway should auto-populate `DATABASE_URL` (from MySQL service)
   - Add these variables:
     ```
     JWT_SECRET=generate-a-random-string-here
     NODE_ENV=production
     NEXT_PUBLIC_API_URL=https://[your-project-name].railway.app
     ```
   - To generate JWT_SECRET, use: `openssl rand -hex 32`

5. **Deploy**
   - Railway automatically builds and deploys when you push to GitHub
   - First deployment takes 3-5 minutes
   - Watch the deployment logs in the dashboard

6. **Setup Database**
   - Click on your MySQL service in Railway
   - Copy the "DATABASE_URL" or individual connection details
   - Connect using Railway's database client or locally:
     ```bash
     # Run migrations
     pnpm db:push

     # Populate sample data
     pnpm db:setup
     ```

### Option 2: Using Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Create a New Project**
   ```bash
   railway init
   ```

4. **Add MySQL Service**
   ```bash
   railway add
   # Select MySQL from the menu
   ```

5. **Set Environment Variables**
   ```bash
   railway variables set DATABASE_URL "mysql://..."
   railway variables set JWT_SECRET "your-generated-secret"
   railway variables set NODE_ENV "production"
   railway variables set NEXT_PUBLIC_API_URL "https://your-project.railway.app"
   ```

6. **Deploy**
   ```bash
   railway up
   ```

7. **Setup Database**
   ```bash
   railway run pnpm db:push
   railway run pnpm db:setup
   ```

## Verify Deployment

1. **Check Application**
   - Visit your Railway project URL
   - You should see the login page

2. **Test Login**
   - Use admin credentials: `admin@taskmanager.com` / `admin123`
   - Or developer credentials: `dev@taskmanager.com` / `dev123`

3. **Check Logs**
   - In Railway dashboard, click "Deployments"
   - View real-time logs for debugging

## Common Issues & Solutions

### Database Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:**
- Verify DATABASE_URL is correctly set in Variables
- Check MySQL service is running (green status)
- Wait 30-60 seconds for MySQL to fully initialize

### JWT Token Errors
```
Error: jwt malformed
```
**Solution:**
- Regenerate JWT_SECRET: `openssl rand -hex 32`
- Update in Railway Variables
- Redeploy application: `git push` or click redeploy in dashboard

### Build Failures
```
Error: Failed to build
```
**Solution:**
- Check build logs in Railway dashboard
- Ensure `.env.local` is in `.gitignore` (don't commit secrets)
- Run locally: `pnpm build` to test

### Database Setup Fails
```
Error running migration
```
**Solution:**
- Ensure DATABASE_URL is correct
- Try again - MySQL may still be initializing
- Check MySQL service logs in Railway dashboard

## Important Notes

### Security
- Never commit `.env.local` to GitHub
- Always use strong, randomly generated JWT_SECRET
- Use Railway's environment variable management, not hardcoded values

### Database Management
- Railway provides automated backups
- For raw database access, use Railway's data browser
- Or SSH into the MySQL container for direct access

### Custom Domain
- In Railway dashboard, go to "Settings"
- Add custom domain and configure DNS

### Monitoring
- View real-time metrics in Railway dashboard
- Check disk usage, memory, and CPU
- Set up alerts for failures

## Rollback

To revert to a previous deployment:
1. Go to "Deployments" in Railway dashboard
2. Find the previous successful deployment
3. Click "Redeploy" on that version

## Troubleshooting Checklist

- [ ] GitHub repository is public or Railway has access
- [ ] All required environment variables are set
- [ ] MySQL service is running (green status)
- [ ] Database migrations ran successfully
- [ ] Application can make requests to database
- [ ] No console errors in browser DevTools
- [ ] JWT_SECRET is strong and random
- [ ] NEXT_PUBLIC_API_URL matches Railway project domain

## Getting Help

- Railway Documentation: https://docs.railway.app
- Railway Support: https://discord.gg/railway
- GitHub Issues: Open an issue in your repository

## Advanced Configuration

### Scheduled Maintenance Tasks
Add to package.json:
```json
{
  "scripts": {
    "postdeploy": "pnpm prisma migrate deploy && pnpm db:seed"
  }
}
```

### Custom Build Script
Edit `railway.toml`:
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "pnpm start"
buildCommand = "pnpm build && pnpm db:push"
```

### Environment-Specific Configuration
Use Railway's deployment variables for staging/production:
```bash
railway variables set --environment staging NODE_ENV "staging"
railway variables set --environment production NODE_ENV "production"
```

## Next Steps After Deployment

1. Test all features with demo accounts
2. Invite team members to create accounts
3. Create your first project
4. Assign tasks and start tracking
5. Monitor application health in Railway dashboard
6. Set up custom domain if needed
7. Enable automatic database backups

Congratulations! Your Task Manager is now live!

