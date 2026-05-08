# ClinicMS — Clinic Management System

A full-stack MERN clinic management platform with role-based access control.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## 👥 Roles
| Role | Access |
|------|--------|
| Admin | Full system control, manage users & appointments |
| Doctor | View assigned patients, update appointment status |
| Patient | Book appointments, view history & notifications |

## 🛠 Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt
