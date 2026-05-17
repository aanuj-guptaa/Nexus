# 🚀 Nexus Portal — Hackathon Submission

> **Enterprise HR Goal Management System** · Built for the Hackathon 2026

---

## 1. 🌐 Live Demo URL

### **[https://nexus-portal-beta.vercel.app](https://nexus-portal-beta.vercel.app)**

---

## 2. 📦 Source Code Repository

### **[https://github.com/aanuj-guptaa/Nexus](https://github.com/aanuj-guptaa/Nexus)**

---

## 3. 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER LAYER                           │
│                                                             │
│    👤 Employee        👔 Manager        🛡️ Admin            │
└──────────┬────────────────┬────────────────┬───────────────┘
           │                │                │
           ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Vercel CDN)                     │
│                                                             │
│         React 18 + TypeScript + Vite + Tailwind CSS         │
│         Framer Motion (animations) · Zustand (state)        │
│         nexus-portal-beta.vercel.app                        │
│         vercel.json — SPA route rewrites                    │
└──────────────────────┬──────────────────────────────────────┘
                       │  REST API + Realtime WebSocket
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Supabase)                         │
│                                                             │
│  ┌──────────────────┐  ┌─────────────────┐  ┌───────────┐  │
│  │  PostgreSQL DB   │  │  Supabase Auth  │  │ Realtime  │  │
│  │                  │  │                 │  │  Engine   │  │
│  │ · profiles       │  │ · Google OAuth  │  │           │  │
│  │ · goal_sheets    │  │ · Email/Password│  │ · WebSocket│ │
│  │ · goals          │  │ · JWT Sessions  │  │ · Postgres │  │
│  │ · goal_actuals   │  │ · Row-Level     │  │   Changes  │  │
│  │ · notifications  │  │   Security (RLS)│  │ · Live     │  │
│  │ · audit_log      │  │                 │  │   Notifs  │  │
│  └──────────────────┘  └─────────────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack Summary

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS + Framer Motion |
| **State Management** | Zustand |
| **Backend / Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth — Google OAuth + Email/Password |
| **Realtime** | Supabase Realtime (WebSocket / Postgres Changes) |
| **Hosting** | Vercel (with SPA rewrites via `vercel.json`) |

> **Security:** Row-Level Security (RLS) policies on all Supabase tables enforce role-based data access at the database level — no client-side role spoofing is possible.

---

## 4. 🔐 Login Credentials & Role Switching

### Evaluator Account

| Field | Value |
|---|---|
| **Email** | `evaluator@nexus.com` |
| **Password** | `nexus2026` |

> **One login. All 3 roles.**
> After signing in, use the **"Switch Journey"** dropdown in the **top-right corner** of the portal to instantly switch between the Employee, Manager, and Admin journeys — **no re-login required**.

---

### Role Journeys — What to Explore

#### 👤 Employee Journey
- View your **Goal Sheet** for Cycle 2026
- Add goals with title, thrust area, measurement type, target, and weightage
- Total weightage must sum to **100%** before submission
- Submit the sheet to your manager for review
- View your **Q1 Check-in scores** with animated progress bars

#### 👔 Manager Journey
- See your **Team Overview** with direct reports, statuses, and average score
- Open **Review Sheets** — approve a sheet or send it back with a rework comment
- Enter **Quarterly Actuals** for each of your team's goals
- The system auto-calculates performance scores per goal

#### 🛡️ Admin Journey
- View the **Completion Heatmap** — org-wide goal sheet progress at a glance
- **Manager Leaderboard** — ranked by team performance score
- **Audit Trail** — timestamped log of every action taken in the system
- Full **Employee Directory** with role and department info

---

## 5. 📋 Key Features

- ✅ **Full CRUD goal management** — create, edit, delete, and submit goal sheets
- ✅ **Multi-role RBAC** — Employee, Manager, Admin with database-level enforcement
- ✅ **Live notifications** via Supabase Realtime WebSocket
- ✅ **Quarterly check-in tracking** — planned vs. actual, with score computation
- ✅ **Approval workflow** — Submit → Manager Review → Approve / Rework
- ✅ **Shared goal templates** — org-wide goals pushed down to employees
- ✅ **Dark mode** — full theme toggle with persisted preference
- ✅ **Responsive, animated UI** — Framer Motion transitions throughout

---

*Submitted for Hackathon 2026 · Nexus Team*
