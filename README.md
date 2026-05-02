# 🧠 Task Manager Application

A full-stack Task Management System that allows teams to manage projects, assign tasks, and track progress with role-based access control.

---

## 🌐 Live Demo

🔗 Live App: https://your-live-link
🎥 Demo Video: https://your-video-link

---

## ✨ Features

### 🔐 Authentication

* User Signup & Login
* JWT-based authentication
* Secure session handling

### 👥 Role-Based Access

* **Admin**

  * Create projects
  * Create & assign tasks
  * Edit/Delete tasks
  * View all activity
* **Developer**

  * View assigned tasks
  * Update task status
  * Log working hours

### 📋 Task Management

* Project-based task organization
* Task assignment system
* Status tracking (Pending → In Progress → Completed)
* Time logging

---

## 🛠️ Tech Stack

| Layer      | Technology     |
| ---------- | -------------- |
| Frontend   | Next.js, React |
| Backend    | Node.js        |
| Database   | MySQL          |
| ORM        | Prisma         |
| Styling    | Tailwind CSS   |
| Auth       | JWT            |
| Deployment | Railway        |

---

## ⚙️ How to Run Locally

### 1️⃣ Clone Repository

```bash
git clone https://github.com/MahithaVedampudi/TaskManager.git
cd TaskManager
```

### 2️⃣ Install Dependencies

```bash
pnpm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in root:

```env
DATABASE_URL="mysql://root:password@localhost:3306/task_manager"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

---

### 4️⃣ Setup Database

```bash
pnpm prisma:generate
pnpm db:push
pnpm db:setup
```

---

### 5️⃣ Run Application

```bash
pnpm dev
```

👉 Open: http://localhost:3000

---

## 🔑 Demo Credentials

### 👨‍💼 Admin

* Email: [admin@taskmanager.com](mailto:admin@taskmanager.com)
* Password: admin123

### 👨‍💻 Developer

* Email: [dev@taskmanager.com](mailto:dev@taskmanager.com)
* Password: dev123

---

## 📽️ Demo Video

(Add your screen recording link here)

---

## 📁 Project Structure

```
TaskManager/
├── app/              # Next.js pages
├── components/       # UI components
├── prisma/           # Database schema
├── scripts/          # Setup scripts
├── lib/              # Utilities & config
├── public/           # Static assets
├── styles/           # CSS files
└── .env              # Environment variables
```

---

## 🚀 Deployment

Deployed using Railway:

1. Push code to GitHub
2. Connect repo to Railway
3. Add environment variables
4. Deploy automatically

---

## 🔒 Security Notes

* Do not commit `.env` file
* Use strong passwords in production
* Generate a secure JWT secret
* Use HTTPS (enabled by Railway)

---

## 🎯 Future Enhancements

* Notifications system
* File attachments
* Real-time updates
* Team collaboration features

---

## 🙌 Acknowledgements

Built as a full-stack project to demonstrate real-world task management workflows with authentication and role-based access control.

---
