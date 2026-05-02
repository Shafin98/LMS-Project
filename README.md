# 📚 LMS — Full Stack Learning Management System

A secure, role-based **Learning Management System** built with **Django REST Framework** and **React**. Designed to support real-world educational workflows — from course creation and student enrollment to admin-level reporting and analytics.

---

## 📌 Project Overview

This LMS supports three types of users — **Admins**, **Instructors**, and **Students** — each with their own interface and access level.

- Admins monitor the platform through a live dashboard
- Instructors create and manage courses and lessons
- Students browse courses, enroll, and view lesson content

The backend is built as a REST API using Django and secured with JWT authentication. The frontend is a React single-page application that communicates with the backend via Axios, with all sensitive routes protected by role-based guards.

---

## ✨ Features

- **JWT Authentication** — register, login, logout, token refresh, and blacklisting on logout
- **Password Reset via Email** — token-based flow with a styled HTML email (Office365 SMTP)
- **Role-Based Access** — Admin, Instructor, and Student roles with custom permission classes
- **Course Management** — Instructors can create, edit, and delete their own courses
- **Lesson Management** — Instructors can add lessons to their own courses only
- **Student Enrollment** — with duplicate enrollment protection and clean error messages
- **Admin Dashboard** — live stats for users, courses, enrollments, and top-performing courses
- **Profile Management** — view and update profile with role-specific fields
- **Protected Routes** — enforced on both backend (DRF) and frontend (React)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Django 6, Django REST Framework |
| Authentication | SimpleJWT |
| Frontend | React 18, Vite |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Routing | React Router v7 |
| Database | SQLite (development) |
| Email | Office365 SMTP |
| Environment | python-dotenv |

---

## ⚙️ Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- pip & npm

---

### 🔧 Backend

**1. Clone the repository**
```bash
git clone https://github.com/your-username/lms-project.git
cd lms-project/backend/lms
```

**2. Create and activate a virtual environment**
```bash
python -m venv venv

# Windows
venv\Scripts\activate or source venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

**3. Install dependencies**
```bash
pip install -r requirements.txt
```

**4. Create your `.env` file (optional)**

Create a `.env` file in the `lms/` folder (same level as `manage.py`):
```env
SECRET_KEY=your_django_secret_key
EMAIL_HOST_USER=your_email@example.com
EMAIL_HOST_PASSWORD=your_email_password
DEFAULT_FROM_EMAIL=Your App <your_email@example.com>
```

**5. Run migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

**6. Create an Admin user**
```bash
python manage.py shell
```
```python
from authapp.models import User
User.objects.create_user(
    username="admin",
    email="admin@example.com",
    password="yourpassword",
    role="admin"
)
exit()
```

**7. Start the backend server**
```bash
python manage.py runserver
```
Runs at → `http://localhost:8000`

---

### 🎨 Frontend

**1. Navigate to the frontend folder**
```bash
cd lms-project/frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the dev server**
```bash
npm run dev
```
Runs at → `http://localhost:5173`

---

## 🖼️ Screenshots

[Login Page]
<p align="center">
  <img src="./src/assets/login.png" alt="Weather App Screenshot" width="700"/>
</p>
[Dashboard]
<p align="center">
  <img src="./src/assets/dashboard.png" alt="Weather App Screenshot" width="700"/>
</p>
[Course List]
<p align="center">
  <img src="./src/assets/course.png" alt="Weather App Screenshot" width="700"/>
</p>

---
