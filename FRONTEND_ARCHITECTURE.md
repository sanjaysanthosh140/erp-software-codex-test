# 🏗️ Alkor ERP - Frontend Architecture & Structure Guide

**A Simple, Clear Guide for Everyone - From Beginners to Advanced Developers**

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Core Technologies](#core-technologies)
4. [Reusable Components](#reusable-components)
5. [Custom Hooks & Context](#custom-hooks--context)
6. [Three Main Dashboards](#three-main-dashboards)
7. [Data Flow Architecture](#data-flow-architecture)
8. [How Everything Works Together](#how-everything-works-together)

---

## 🎯 Project Overview

**Alkor ERP** is a modern web application built for **Employee & Project Management**. Think of it as a central system where:

- **Employees** track their work, projects, and attendance
- **Department Heads** manage projects and team members
- **HR** oversees all employees, projects, and reports

**Built With:**
- React 19 (UI framework)
- Vite (build tool - fast development)
- Material-UI (MUI) - professional design components
- Axios - API communication
- Socket.io - real-time chat
- Framer Motion - smooth animations
- React Router - page navigation

---

## 📁 Folder Structure - Explained

```
Alkor_erp/
│
├── 📄 package.json          (Project dependencies & scripts)
├── 📄 vite.config.js        (Build configuration)
├── 📄 eslint.config.js      (Code quality rules)
├── 📄 index.html            (Main HTML file)
│
└── 📂 src/                  (All source code)
    │
    ├── 📄 main.jsx          (App entry point)
    ├── 📄 App.jsx           (Main routing setup)
    ├── 📄 theme.js          (Color & design system)
    ├── 📄 index.css         (Global styles)
    ├── 📄 App.css           (App styles)
    │
    ├── 📂 context/          (Global state & shared data)
    │   └── ToastContext.jsx (Notification system - used everywhere)
    │
    ├── 📂 components/       (Reusable UI components)
    │   ├── 📂 common/
    │   │   └── GlassComp.jsx        (Glass effect containers)
    │   │
    │   ├── 📂 layout/       (Page layout wrappers)
    │   │   ├── MainLayout.jsx       (Admin/Head pages layout)
    │   │   ├── EmployeeLayout.jsx   (Employee pages layout)
    │   │   ├── Sidebar.jsx          (Navigation menu)
    │   │   └── Topbar.jsx           (Top navigation bar)
    │   │
    │   ├── 📂 dashboard/    (Dashboard sub-components)
    │   │   ├── ActiveProjectTracker.jsx      (Shows current projects)
    │   │   ├── DeadlineNotifications.jsx     (Alerts for deadlines)
    │   │   ├── ProjectBoard.jsx              (Project kanban board)
    │   │   ├── ProjectsPreview.jsx           (List of projects)
    │   │   ├── TaskCard.jsx                  (Individual task card)
    │   │   ├── TaskHistory.jsx               (Past tasks log)
    │   │   ├── UserReportsList.jsx           (Employee work reports)
    │   │   └── WorkReportForm.jsx            (Submit daily reports)
    │   │
    │   ├── AttendanceWidget.jsx     (Punch in/out, time tracking)
    │   ├── TeamChat.jsx             (Real-time messaging)
    │   ├── CustomProjectDialog.jsx  (Create/edit projects)
    │   ├── CreateProjectDialog.jsx  (Project creation modal)
    │   ├── Employeeeverything.jsx   (Employee data viewer)
    │   └── EverythingComponent.jsx  (Data display component)
    │
    ├── 📂 pages/            (Full-page components/screens)
    │   │
    │   ├── 📂 Auth/         (Login & signup)
    │   │   ├── Login.jsx
    │   │   └── Signup.jsx
    │   │
    │   ├── 📂 Admin/        (Super admin area - to be built)
    │   │
    │   ├── 📂 Dashboard/
    │   │   └── DepartmentGateway.jsx        (Department selection page)
    │   │
    │   ├── 📂 Employee/     (Employee dashboard area)
    │   │   ├── EmployeeCockpit.jsx          (Main employee dashboard)
    │   │   ├── AssignedProjectsList.jsx     (My projects page)
    │   │   ├── ProjectDetailView.jsx        (Single project details)
    │   │   └── UserProfile.jsx              (Profile settings)
    │   │
    │   ├── 📂 admin-side/   (HR & Head management dashboards)
    │   │   ├── Head.jsx                     (Head dashboard - main)
    │   │   ├── HRDashboard.jsx              (HR dashboard - main)
    │   │   ├── Admin.jsx                    (CEO dashboard)
    │   │   ├── AdminRoleManager.jsx         (User role management)
    │   │   ├── HeadProjectView.jsx          (Head project details)
    │   │   ├── HeadProjectOverview.jsx      (Head projects list)
    │   │   ├── CustomProjectsList.jsx       (Custom projects page)
    │   │   ├── CustomProjectDetail.jsx      (Custom project detail)
    │   │   ├── HRProjectProgress.jsx        (HR project tracking)
    │   │   │
    │   │   └── 📂 components/   (Dashboard-specific components)
    │   │       ├── AttendanceManager.jsx    (Track employee attendance)
    │   │       ├── DepartmentManager.jsx    (Manage departments)
    │   │       ├── EmployeeManager.jsx      (Manage employees)
    │   │       ├── ReportManager.jsx        (Review reports)
    │   │       ├── DashboardDialogs.jsx     (Modal popups)
    │   │       ├── GlassCard.jsx            (Card component)
    │   │       ├── SharedStyles.jsx         (Common styling)
    │   │       └── StatCards.jsx            (Statistics display)
    │   │
    │   ├── Landing.jsx              (Home/landing page)
    │   ├── Projects.jsx             (Projects listing)
    │   └── Notifications.jsx        (Notifications page)
    │
    ├── 📂 assets/           (Images, icons, static files)
    │
    └── 📂 public/           (Static files served directly)

```

---

## 💡 Core Technologies Explained

### React
**What it is:** A JavaScript library that builds interactive UIs
**Why we use it:** Fast, component-based, great for complex apps

### Vite
**What it is:** A fast build tool
**Why we use it:** Development is super fast (npm run dev)

### Material-UI (MUI)
**What it is:** Pre-made beautiful components (buttons, cards, tables, etc.)
**Why we use it:** Saves time, looks professional, responsive on mobile

### Axios
**What it is:** A tool to talk to the backend server
**Why we use it:** Fetching data, sending updates to the API

### Socket.io
**What it is:** Real-time communication
**Why we use it:** Chat feature works instantly (TeamChat.jsx)

### Framer Motion
**What it is:** Animation library
**Why we use it:** Smooth, professional animations

---

## 🧩 Reusable Components (Used Everywhere)

### 1. **GlassComp.jsx** - Glass Effect Containers
```
Purpose: Creates a frosted glass effect (very popular in modern UI)
Used By: Almost every page
What it does: Wraps content with a glass-like background
```

### 2. **AttendanceWidget.jsx** - Time Tracking
```
Purpose: Shows employee time tracking (punch in/out)
Used By: Employee Dashboard (EmployeeCockpit)
Features:
  - Current date & time display
  - Punch in/out buttons
  - Break tracking
  - Active projects count
```

### 3. **Sidebar.jsx** - Navigation Menu
```
Purpose: Left-side menu for navigation
Used By: MainLayout, EmployeeLayout
Features:
  - Dashboard link
  - Settings link
  - Logout button
  - Responsive (collapses on mobile)
```

### 4. **Topbar.jsx** - Top Navigation
```
Purpose: Top header bar
Used By: All pages with layout
Features:
  - User menu
  - Notifications
  - Professional styling
```

### 5. **ProjectsPreview.jsx** - Project List Display
```
Purpose: Shows a list of projects
Used By: Employee Dashboard, Head Dashboard
Features:
  - Shows project details
  - Click to view more
  - Status indicators (pending, active, completed)
```

### 6. **TaskCard.jsx** - Individual Task Display
```
Purpose: Shows one task in a nice card format
Used By: ProjectBoard, various dashboards
Features:
  - Task title & description
  - Priority indicator
  - Status badge
```

### 7. **UserReportsList.jsx** - Reports Viewer
```
Purpose: Display list of employee work reports
Used By: Employee Dashboard, HR Dashboard
Features:
  - Shows submitted reports
  - Edit/delete options
  - Date filtering
```

### 8. **WorkReportForm.jsx** - Submit Daily Report
```
Purpose: Form for employees to submit daily work reports
Used By: Employee Dashboard
Features:
  - Text area for report
  - Submit button
  - Auto-includes UserReportsList inside it
```

### 9. **TeamChat.jsx** - Real-time Chat
```
Purpose: Instant messaging between team members
Used By: Head Dashboard, HR Dashboard
Features:
  - Real-time messages (Socket.io)
  - Message history
  - User avatars
```

### 10. **CustomProjectDialog.jsx** - Project Creation Modal
```
Purpose: Modal popup to create/edit custom projects
Used By: Head Dashboard, Admin Dashboard
Features:
  - Select departments
  - Set project details
  - Assign tasks
```

---

## 🎣 Custom Hooks & Context (Global State)

### ToastContext - Notification System
```javascript
Location: src/context/ToastContext.jsx

What it is: Global notification system
How it works: Wrap your app with <ToastProvider>, then use useToast() anywhere

Example Usage:
  const { showToast } = useToast();
  showToast("Success!", "success");  // Green notification
  showToast("Error!", "error");      // Red notification

Used by: Almost every component for alerts
```

**Color Codes:**
- `success` → Green (✓ completed)
- `error` → Red (✗ failed)
- `warning` → Orange (⚠ attention)
- `info` → Blue (ℹ information)

---

## 📊 Three Main Dashboards

### 1️⃣ **EMPLOYEE DASHBOARD** (EmployeeCockpit.jsx)
**Who uses it:** Regular employees

**What they see:**
```
┌─────────────────────────────────────┐
│  Welcome back, [Name] 👋            │
├─────────────────────────────────────┤
│                                     │
│  📅 Attendance Widget               │
│  ├─ Current Date                    │
│  ├─ Current Time                    │
│  ├─ Punch In/Out Buttons            │
│  └─ Active Projects Count           │
│                                     │
│  📋 Projects Preview                │
│  ├─ Project 1 [Active]              │
│  ├─ Project 2 [Pending]             │
│  └─ Project 3 [Completed]           │
│                                     │
│  ✍️ Work Report Form                │
│  ├─ Text area for daily report      │
│  ├─ Submit button                   │
│  └─ My Reports List (below)         │
│                                     │
│  📑 My Work Reports                 │
│  ├─ Report from Monday              │
│  ├─ Report from Tuesday             │
│  └─ Report from Wednesday           │
│                                     │
│  💬 Team Chat                       │
│  └─ Real-time messaging             │
│                                     │
└─────────────────────────────────────┘
```

**Main Components:**
- `AttendanceWidget` - Time tracking
- `ProjectsPreview` - My assigned projects
- `WorkReportForm` - Submit daily reports
- `UserReportsList` - View my reports
- `TeamChat` - Chat with team

**Key Functions:**
1. View assigned projects
2. Track attendance (punch in/out)
3. Submit daily work reports
4. View project details
5. Real-time team chat

---

### 2️⃣ **HEAD DASHBOARD** (Head.jsx)
**Who uses it:** Department heads/managers

**What they see:**
```
┌──────────────────────────────────────┐
│  Department Head Dashboard           │
├──────────────────────────────────────┤
│                                      │
│  🎯 Quick Actions                    │
│  ├─ Create New Task                  │
│  ├─ Create Custom Project            │
│  └─ View Project Overview            │
│                                      │
│  📊 Department Tasks                 │
│  ├─ Pending: 5                       │
│  ├─ In Progress: 3                   │
│  └─ Completed: 12                    │
│                                      │
│  📁 Projects I Created               │
│  ├─ Project A [Pending]              │
│  ├─ Project B [Active]               │
│  └─ Project C [Completed]            │
│                                      │
│  ✅ Custom Projects Overview         │
│  ├─ See all custom projects          │
│  └─ Edit/Delete options              │
│                                      │
│  📈 Project History                  │
│  ├─ Past projects view               │
│  └─ Performance metrics              │
│                                      │
│  💬 Team Chat                        │
│  └─ Department communication         │
│                                      │
└──────────────────────────────────────┘
```

**Main Components:**
- `CustomProjectDialog` - Create/edit projects
- `CustomProjectsList` - List custom projects
- `HeadProjectView` - Project details for heads
- `HeadProjectOverview` - Overview of all projects
- `TeamChat` - Department chat
- `ProjectsPreview` - Quick project view
- Various stat cards showing metrics

**Key Functions:**
1. Create and manage custom projects
2. Assign tasks to employees
3. Track project progress
4. View department performance
5. Communicate with team
6. Manage project deadlines

---

### 3️⃣ **HR DASHBOARD** (HRDashboard.jsx)
**Who uses it:** Human Resources managers

**What they see:**
```
┌──────────────────────────────────────┐
│  HR Dashboard                        │
├──────────────────────────────────────┤
│                                      │
│  📊 Statistics Section               │
│  ├─ Total Employees                  │
│  ├─ Total Projects                   │
│  ├─ Completed Tasks                  │
│  └─ Active Projects                  │
│                                      │
│  👥 Employee Management Tab          │
│  ├─ View all employees               │
│  ├─ Employee details                 │
│  └─ Attendance records               │
│                                      │
│  📁 Projects Overview Tab            │
│  ├─ All company projects             │
│  ├─ Project status                   │
│  └─ Team assignments                 │
│                                      │
│  📋 Reports Management Tab           │
│  ├─ Employee work reports            │
│  ├─ Report approval                  │
│  └─ Report history                   │
│                                      │
│  📈 Project Progress Tab             │
│  ├─ Project tracking                 │
│  ├─ Deadline alerts                  │
│  └─ Performance metrics              │
│                                      │
│  💬 Team Communication               │
│  └─ Cross-department chat            │
│                                      │
└──────────────────────────────────────┘
```

**Main Components:**
- `StatCards` - Show key metrics
- `EmployeeManager` - Manage employees
- `ReportManager` - Review employee reports
- `AttendanceManager` - Track attendance
- `HRProjectProgress` - Project tracking
- `TeamChat` - Department communication
- `DashboardDialogs` - Modal forms

**Key Functions:**
1. View all employees
2. Track employee attendance
3. Review work reports
4. Monitor all projects company-wide
5. Assign employees to projects
6. View performance metrics
7. Generate reports

---

## 🔄 Data Flow Architecture

### How Data Moves Through the App

```
┌────────────────────────────────────────────────────────────┐
│                   User Interaction (UI)                     │
│              (Click button, submit form, etc)              │
└─────────────────────────┬──────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────┐
│                  React Component                            │
│           (EmployeeCockpit, Head, HRDashboard)             │
│                                                             │
│  - Stores state with useState()                           │
│  - Manages local data                                      │
│  - Handles user input                                      │
└─────────────────────────┬──────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────┐
│              API Request via Axios                          │
│                                                             │
│  Example:                                                   │
│  axios.get("/api/employees")      [Get data]              │
│  axios.post("/api/tasks", data)   [Send data]             │
│  axios.put("/api/tasks/1", data)  [Update data]           │
│  axios.delete("/api/tasks/1")     [Delete data]           │
└─────────────────────────┬──────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────┐
│              Backend Server (Node.js)                       │
│        https://project-management-sodtware-backend-end.onrender.com
│                                                             │
│  - Database queries                                        │
│  - Authentication                                          │
│  - Business logic                                          │
│  - Returns response (JSON)                                │
└─────────────────────────┬──────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────┐
│           Response Returns to Component                     │
│                                                             │
│  - Success: Update component state                         │
│  - Error: Show error toast notification                    │
│  - UI automatically updates (re-render)                    │
└─────────────────────────┬──────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────┐
│         Optionally: Show Toast Notification                │
│                                                             │
│  showToast("Task created!", "success")    [Green]          │
│  showToast("Error occurred!", "error")    [Red]            │
└────────────────────────────────────────────────────────────┘
```

---

## 🔌 Real-Time Features

### Socket.io - Live Messaging
```
┌────────────────────────────────────────────┐
│         User A (Employee)                  │
│                                            │
│  Types message in TeamChat                │
│  ✍️ "Great work team!"                    │
│          │                                │
│          ▼                                │
│    Emits via Socket.io                   │
│  ───────────────────────────────────────► │
│                                            │
│                          Backend Server   │
│                          (Receives)       │
│                             │             │
│                             ▼             │
│                      Broadcasts to       │
│                      all connected       │
│                      users              │
│                             │             │
│         ┌───────────────────┼──────────┐ │
│         │                   │          │  │
│         ▼                   ▼          ▼  │
│    User B (Head)     User C (HR)  User D  │
│                                            │
│    All see message instantly! ⚡           │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🛣️ How Everything Works Together

### Example: Employee Submitting a Work Report

```
STEP 1: Employee Opens App
└─ Clicks "Employee Dashboard"
   └─ EmployeeCockpit.jsx loads
      └─ Shows AttendanceWidget, ProjectsPreview, WorkReportForm

STEP 2: Employee Submits Report
└─ Employee types report in textarea
   └─ Clicks "Submit Report" button
      └─ WorkReportForm captures the text

STEP 3: Submit Logic
└─ onClick handler triggered
   └─ Axios sends POST request to backend
      └─ Backend saves report to database
         └─ Returns success response

STEP 4: Update UI
└─ If success: 
   ├─ Show green toast "Report submitted!"
   ├─ Clear textarea
   └─ UserReportsList refreshes to show new report
   
└─ If error:
   ├─ Show red toast "Error: Please try again"
   └─ Form stays filled (user can retry)

STEP 5: Real-time Updates
└─ HR Dashboard automatically sees new report
   └─ If using Socket.io, it updates instantly ⚡
      └─ HR Manager can review/approve
```

### Example: Head Creating a Custom Project

```
STEP 1: Head Opens Dashboard
└─ Head.jsx loads
   └─ Shows create project button

STEP 2: Head Clicks "Create Custom Project"
└─ CustomProjectDialog opens
   └─ Shows form to:
      ├─ Enter project title
      ├─ Select departments
      └─ Set project details

STEP 3: Head Fills Form & Submits
└─ Form validation
   └─ Axios sends POST to backend with:
      ├─ Project name
      ├─ Selected departments
      ├─ Project details
      └─ Head ID (from token)

STEP 4: Backend Processes
└─ Saves project to database
   └─ Creates initial tasks
      └─ Sends success response

STEP 5: Frontend Updates
└─ Success toast shown
   └─ CustomProjectDialog closes
      └─ Project appears in CustomProjectsList
         └─ Employees can now see in their dashboard

STEP 6: Real-time Notifications
└─ Email/push sent to assigned employees
   └─ They see project in their ProjectsPreview
      └─ They can start working on it
```

---

## 🎨 Design System

### Colors Used Throughout App

```
Primary Colors:
  ├─ Dark Navy: #0f172a (Headers, important text)
  ├─ Slate Gray: #475569 (Secondary text)
  └─ Indigo: #4f46e5 (Accent, buttons)

Backgrounds:
  ├─ White: #ffffff (Main content)
  ├─ Light Gray: #fcfcfc (Page background)
  ├─ Dark: #0a0e17 (Dark theme)
  └─ Glass: rgba(255,255,255,0.75) (Frosted effect)

Status Colors:
  ├─ Success: #10b981 (Green - completed)
  ├─ Error: #ef4444 (Red - failed)
  ├─ Warning: #f59e0b (Orange - attention)
  └─ Info: #4f46e5 (Blue - information)

Glass Effect:
  ├─ Background: rgba(255,255,255,0.85)
  ├─ Blur: blur(24px)
  └─ Border: 1px solid rgba(10,15,25,0.08)
```

---

## 🎯 Key Concepts to Understand

### 1. **State Management**
```javascript
// Local state in components
const [projects, setProjects] = useState([]);

// When state changes:
// 1. Component re-renders
// 2. UI updates automatically
// 3. No page refresh needed
```

### 2. **API Communication**
```javascript
// Get data
const response = await axios.get("/api/employees");

// Send data
await axios.post("/api/tasks", { title, description });

// Update data
await axios.put("/api/tasks/1", { title: "Updated" });

// Delete data
await axios.delete("/api/tasks/1");
```

### 3. **Conditional Rendering**
```javascript
// Show different content based on condition
{user.role === "employee" && <EmployeeDashboard />}
{user.role === "head" && <HeadDashboard />}
{user.role === "hr" && <HRDashboard />}
```

### 4. **Props (Passing Data to Components)**
```javascript
// Parent component
<TaskCard title="My Task" priority="High" status="pending" />

// TaskCard component receives props
export default function TaskCard({ title, priority, status }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>Priority: {priority}</p>
      <p>Status: {status}</p>
    </div>
  );
}
```

---

## 📱 Responsive Design

### How App Adapts to Screen Size

```
Desktop (1200px+)
├─ Full Sidebar visible with labels
├─ Wide tables and layouts
└─ Full feature access

Tablet (768px - 1199px)
├─ Sidebar collapses to icons only
├─ Adjusted spacing
└─ Touch-friendly buttons

Mobile (< 768px)
├─ Sidebar becomes hamburger menu (slide-out)
├─ Single column layout
├─ Large touch targets
└─ Optimized for thumb navigation
```

---

## 🚀 Common Workflows

### User Workflow: Login → Dashboard → Submit Report

```
1. User goes to website
   └─ Lands on Login.jsx page
      └─ Enters email & password
         └─ Clicks "Login"
            └─ Axios sends credentials to backend

2. Backend validates
   └─ If correct:
      ├─ Creates JWT token
      ├─ Saves token to localStorage
      └─ Returns role (employee/head/hr)
   
   └─ If wrong:
      └─ Shows error toast

3. Frontend redirects based on role
   └─ Employee → EmployeeCockpit
   └─ Head → Head.jsx
   └─ HR → HRDashboard.jsx

4. Dashboard loads
   └─ Fetches user data from API
   └─ Displays all components
   └─ Ready for interaction

5. Employee submits report
   └─ Types in WorkReportForm
   └─ Clicks Submit
   └─ Toast confirms success
   └─ Report appears in UserReportsList

6. Employee can now
   └─ View assigned projects
   └─ Chat with team
   └─ Track attendance
   └─ View their reports
```

---

## 🔐 Authentication & Security

### How Login Works

```
Login Form:
  ├─ Email input
  ├─ Password input
  └─ Submit button
       │
       ▼
  API Check
  ├─ Email exists?
  ├─ Password correct?
  └─ User active?
       │
       ├─ Yes → Generate JWT Token
       │         (like a digital ID card)
       │         │
       │         └─ Save to localStorage
       │            (browser's local storage)
       │            │
       │            └─ User logged in! ✅
       │
       └─ No → Show error message
               (Red toast notification)

Future Requests:
  └─ Every API call includes token
     ├─ Token sent in headers
     └─ Backend validates token
        ├─ Valid → Process request
        └─ Invalid → Send back to login
```

---

## 📊 Component Reusability Summary

| Component | Used By | Purpose |
|-----------|---------|---------|
| GlassComp | All dashboards | Glass effect containers |
| AttendanceWidget | Employee Dashboard | Time tracking |
| ProjectsPreview | Employee, Head, HR | Show project lists |
| TaskCard | All dashboards | Display individual tasks |
| UserReportsList | Employee, HR | Show work reports |
| WorkReportForm | Employee Dashboard | Submit daily reports |
| TeamChat | Head, HR Dashboards | Real-time messaging |
| Sidebar | Main, Employee Layout | Navigation menu |
| Topbar | All pages | Top header bar |
| StatCards | HR Dashboard | Show key metrics |
| EmployeeManager | HR Dashboard | Manage employees |
| ReportManager | HR Dashboard | Review reports |

---

## 🎓 Developer Guide: Adding New Features

### Adding a New Component

```javascript
// 1. Create new file: src/components/MyComponent.jsx
import React from 'react';

export default function MyComponent({ prop1, prop2 }) {
  return (
    <div>
      <h2>{prop1}</h2>
      <p>{prop2}</p>
    </div>
  );
}

// 2. Import in parent component
import MyComponent from './MyComponent';

// 3. Use the component
<MyComponent prop1="Title" prop2="Description" />
```

### Adding API Call

```javascript
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const MyComponent = () => {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/my-endpoint');
      setData(response.data);
      showToast('Data loaded!', 'success');
    } catch (error) {
      showToast('Error loading data!', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  return <div>{/* Display data */}</div>;
};
```

---

## ✅ Testing Your Changes

### During Development

```bash
# Terminal
npm run dev

# Open browser and navigate to http://localhost:5173
# Click around, submit forms, check console for errors
```

### Check for Errors

```javascript
// Open Developer Tools (F12 in browser)
// Go to Console tab
// Look for red error messages
// Fix them before deploying
```

---

## 🎯 Summary

**Alkor ERP Frontend is built on:**
1. **React Components** - Reusable UI building blocks
2. **State Management** - Local component state + Context API
3. **API Communication** - Axios for backend communication
4. **Real-time Features** - Socket.io for live chat
5. **Modern Design** - Material-UI + Glass effects
6. **Role-based Dashboards** - Different views for different users

**Three Main Dashboards:**
- **Employee** - Track work and attendance
- **Head** - Manage projects and team
- **HR** - Oversee all employees and projects

**Key Reusable Components:**
- Glass containers, cards, forms, tables, dialogs, and more

---

## 📞 Quick Reference

| Need | File | Component |
|------|------|-----------|
| Show notification | ToastContext.jsx | useToast() |
| Login screen | Login.jsx | Login page |
| Employee home | EmployeeCockpit.jsx | Main dashboard |
| Head home | Head.jsx | Head dashboard |
| HR home | HRDashboard.jsx | HR dashboard |
| Create project | CustomProjectDialog.jsx | Project modal |
| Real-time chat | TeamChat.jsx | Chat component |
| Navigation | Sidebar.jsx | Menu |
| Time tracking | AttendanceWidget.jsx | Punch in/out |
| Work reports | WorkReportForm.jsx | Submit reports |

---

**Created:** May 2026  
**Version:** 1.0  
**For:** Alkor ERP Frontend Team

