# 🎨 Alkor ERP - Visual Architecture Diagrams

**Simple Diagrams & Flow Charts - For Everyone**

---

## 1️⃣ Application Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         ALKOR ERP APPLICATION                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   BROWSER (Frontend)                     │   │
│  │                                                           │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │              React Application                     │  │   │
│  │  │  (Built with Vite - super fast development)      │  │   │
│  │  │                                                    │  │   │
│  │  │  Components          │  Pages           │  Context│  │   │
│  │  │  ├─ GlassComp       │  ├─ Login        │  └─ Toast│  │   │
│  │  │  ├─ Sidebar         │  ├─ Dashboard    │          │  │   │
│  │  │  ├─ TaskCard        │  ├─ Employee     │          │  │   │
│  │  │  ├─ AttendanceWid   │  ├─ Head         │          │  │   │
│  │  │  ├─ ProjectsView    │  └─ HR           │          │  │   │
│  │  │  └─ TeamChat        │                  │          │  │   │
│  │  │                                                    │  │   │
│  │  │  Material-UI + Framer Motion (Animations)         │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                           ▲                              │   │
│  │                           │ Axios                         │   │
│  │                           │ (API calls)                   │   │
│  │                           ▼                              │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │         Socket.io (Real-time Chat)                │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ▲      ▲                               │
│                           │      │                               │
│           HTTP/HTTPS      │      │        WebSocket               │
│           Requests        │      │        Connection              │
│                           │      │                               │
│  ┌────────────────────────┴──────┴────────────────────────────┐   │
│  │              Backend Server (Node.js)                      │   │
│  │                                                            │   │
│  │  https://project-management-sodtware-backend-end         │   │
│  │         .onrender.com                                    │   │
│  │                                                            │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  API Routes                                      │   │   │
│  │  │  ├─ /login        (Authentication)              │   │   │
│  │  │  ├─ /employees    (Employee management)         │   │   │
│  │  │  ├─ /projects     (Project management)          │   │   │
│  │  │  ├─ /tasks        (Task management)             │   │   │
│  │  │  ├─ /reports      (Work reports)                │   │   │
│  │  │  └─ /attendance   (Attendance tracking)         │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                           ▼                              │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  Database                                        │   │   │
│  │  │  ├─ Users Table        (Employee data)          │   │   │
│  │  │  ├─ Projects Table     (Project data)           │   │   │
│  │  │  ├─ Tasks Table        (Task data)              │   │   │
│  │  │  ├─ Reports Table      (Work reports)           │   │   │
│  │  │  └─ Attendance Table   (Punch in/out records)   │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2️⃣ Folder Structure - Tree View

```
src/
│
├── 📂 context/
│   └── ToastContext.jsx ..................... Global Notifications
│
├── 📂 components/ ........................... Reusable UI Components
│   │
│   ├── 📂 common/
│   │   └── GlassComp.jsx ................... Frosted Glass Effect
│   │
│   ├── 📂 layout/
│   │   ├── MainLayout.jsx ................. Admin/Head wrapper
│   │   ├── EmployeeLayout.jsx ............. Employee wrapper
│   │   ├── Sidebar.jsx .................... Navigation menu
│   │   └── Topbar.jsx ..................... Top header
│   │
│   ├── 📂 dashboard/ ....................... Dashboard Widgets
│   │   ├── ProjectsPreview.jsx ............ Projects list
│   │   ├── TaskCard.jsx ................... Single task
│   │   ├── ActiveProjectTracker.jsx ....... Current projects
│   │   ├── UserReportsList.jsx ............ Reports viewer
│   │   ├── WorkReportForm.jsx ............. Report submission
│   │   ├── ProjectBoard.jsx ............... Kanban board
│   │   ├── DeadlineNotifications.jsx ...... Alerts
│   │   └── TaskHistory.jsx ................ Past tasks
│   │
│   ├── AttendanceWidget.jsx ............... ⏰ Punch in/out
│   ├── TeamChat.jsx ....................... 💬 Real-time chat
│   ├── CustomProjectDialog.jsx ............ Modal for projects
│   ├── CreateProjectDialog.jsx ............ Create project modal
│   └── Employeeeverything.jsx ............. Employee data viewer
│
├── 📂 pages/ ................................ Full Page Views
│   │
│   ├── 📂 Auth/
│   │   ├── Login.jsx ....................... 🔐 Login page
│   │   └── Signup.jsx ...................... 📝 Registration
│   │
│   ├── 📂 Dashboard/
│   │   └── DepartmentGateway.jsx .......... Department selection
│   │
│   ├── 📂 Employee/ ......................... Employee Area
│   │   ├── EmployeeCockpit.jsx ............ Main employee dashboard
│   │   ├── AssignedProjectsList.jsx ....... My projects
│   │   ├── ProjectDetailView.jsx .......... Project details
│   │   └── UserProfile.jsx ................ Profile settings
│   │
│   ├── 📂 admin-side/ ....................... Management Area
│   │   │
│   │   ├── 📂 components/ .................. Admin Components
│   │   │   ├── AttendanceManager.jsx
│   │   │   ├── EmployeeManager.jsx
│   │   │   ├── ReportManager.jsx
│   │   │   ├── DepartmentManager.jsx
│   │   │   ├── StatCards.jsx
│   │   │   └── SharedStyles.jsx
│   │   │
│   │   ├── Head.jsx ........................ 👔 Head dashboard
│   │   ├── HRDashboard.jsx ................ 👥 HR dashboard
│   │   ├── Admin.jsx ....................... 🏆 CEO dashboard
│   │   ├── HeadProjectView.jsx ............ Head project details
│   │   ├── HeadProjectOverview.jsx ........ Head projects overview
│   │   ├── CustomProjectsList.jsx ......... Projects list
│   │   ├── CustomProjectDetail.jsx ........ Project details
│   │   ├── HRProjectProgress.jsx .......... HR project tracking
│   │   └── AdminRoleManager.jsx ........... User roles
│   │
│   ├── Landing.jsx .......................... 🏠 Home page
│   ├── Projects.jsx ......................... 📁 Projects page
│   └── Notifications.jsx .................... 🔔 Notifications page
│
├── App.jsx ................................. ⚙️ Main app routing
├── main.jsx ................................ 🚀 Entry point
├── theme.js ................................ 🎨 Color system
├── index.css ............................... 🎯 Global styles
└── App.css ................................. 📋 App styles
```

---

## 3️⃣ Component Hierarchy - How Components Nest

```
                           App.jsx
                           (Main)
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
      ToastProvider      ThemeProvider      Router
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    Routes (Navigation)
                             │
          ┌──────────┬────────┼────────┬──────────┐
          │          │        │        │          │
       Login      Signup   Landing  MainLayout  EmployeeLayout
          │          │        │        │          │
          │          │        │    Sidebar    Sidebar
          │          │        │    Topbar     Topbar
          │          │        │        │          │
          │          │        │    ┌───┴────┐     │
          │          │        │    │        │     │
          │          │        │   Head   Admin  EmployeeCockpit
          │          │        │    │            │
          │          │        │    ├─ CustomProjectDialog
          │          │        │    ├─ HeadProjectView
          │          │        │    ├─ ProjectsPreview
          │          │        │    ├─ TeamChat
          │          │        │    └─ StatCards
          │          │        │              │
          │          │        │              ├─ AttendanceWidget
          │          │        │              ├─ ProjectsPreview
          │          │        │              ├─ WorkReportForm
          │          │        │              │   └─ UserReportsList
          │          │        │              ├─ TeamChat
          │          │        │              └─ TaskCard
          │          │        │
    HRDashboard ────────────────────┐
          │                          │
          ├─ StatCards             │
          ├─ EmployeeManager       │
          ├─ ReportManager         │
          ├─ AttendanceManager     │
          ├─ UserReportsList       │
          ├─ HRProjectProgress     │
          ├─ ProjectsPreview       │
          ├─ TeamChat              │
          └─ Various Dialogs       │
                                   │
                         (All using shared
                          components and
                          ToastContext)
```

---

## 4️⃣ Role-Based Access Flow

```
                          START: LOGIN PAGE
                                 │
                    ┌────────────┴────────────┐
                    │                         │
              Enter Email                Enter Password
                    │                         │
                    └────────────┬────────────┘
                                 │
                        Click "Login" Button
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   API: /admin/login     │
                    │   Backend Validates     │
                    └────────┬────────┬───────┘
                             │        │
                    ✅ Success        ❌ Error
                             │        │
                             │        └─► Show Error Toast
                             │             (Red notification)
                             │
                ┌────────────┴────────────┐
                │ Receive JWT Token      │
                │ Store in localStorage   │
                │ Get User Role:          │
                └────────┬───────┬───────┬──┘
                         │       │       │
                    ┌────┴───┐   │   ┌───┴────┐
                    │        │   │   │        │
              "employee" "head" "hr" "ceo"
                    │        │   │   │        │
                    │        │   │   │        └─► Admin.jsx (CEO)
                    │        │   │   │             └─ CEO Controls
                    │        │   │   │
                    │        │   │   └──► HRDashboard.jsx
                    │        │   │        ├─ All employees
                    │        │   │        ├─ All projects
                    │        │   │        ├─ All reports
                    │        │   │        └─ Performance metrics
                    │        │   │
                    │        │   └──► (Future HR role)
                    │        │
                    │        └──► Head.jsx
                    │             ├─ My projects
                    │             ├─ My team
                    │             ├─ My tasks
                    │             ├─ Custom projects
                    │             └─ Team chat
                    │
                    └──► EmployeeCockpit.jsx (Employee)
                         ├─ Punch in/out
                         ├─ My projects
                         ├─ Submit reports
                         ├─ View my reports
                         └─ Team chat


            ⚡ Token Stored = User Stays Logged In
            🔄 Every API call includes token in headers
            🔐 Invalid token = Sent back to login page
```

---

## 5️⃣ Employee Dashboard Flow

```
    EMPLOYEE OPENS APP
           │
           ▼
    EmployeeCockpit.jsx (Main Dashboard)
           │
    ┌──────┼──────┬──────┬────────────────┐
    │      │      │      │                │
    ▼      ▼      ▼      ▼                ▼
   🔤   ⏰     📋      ✍️            💬
Header Time   Projects Work Report  Team Chat
   │   │      │      │                │
   │   │      │      │                │
Welcome Punch In/Out See My    Submit Daily  Talk with
[Name] 👋  Check   Projects   Work Report   Team
   │   Status      │         │
   │   │      │         │
   │   │   ├─ Active  │
   │   │   ├─ Pending │
   │   │   └─ Completed
   │   │      │
   │   │   Click to View
   │   │   Project Details
   │   │
   │   └─ Button: CHECK IN
   │      └─ Starts day
   │      │ └─ Tracks time
   │      └─ At end of day:
   │         │
   │         └─ Button: CHECK OUT
   │            └─ Ends day
   │            └─ Shows elapsed time
   │
   └─ Components Used:
      ├─ AttendanceWidget (Punch system)
      ├─ ProjectsPreview (My projects)
      ├─ WorkReportForm (Submit report)
      ├─ UserReportsList (My reports)
      ├─ TeamChat (Real-time chat)
      └─ Sidebar + Topbar (Navigation)
```

---

## 6️⃣ Head Dashboard Flow

```
     HEAD OPENS APP
            │
            ▼
    Head.jsx (Department Dashboard)
            │
  ┌─────────┼────────────┬──────────┬─────────┐
  │         │            │          │         │
  ▼         ▼            ▼          ▼         ▼
🎯      📊         📁        📈      💬
Create  Show Stats Create   Project History Team
Task    │        Projects   Overview        Chat
        │        │          │
        │    ├─ Total Tasks │
        │    ├─ Completed   │
        │    ├─ Active      │
        │    └─ Pending     │
        │                   │
        └─ Show My Work
           ├─ Tasks Created
           ├─ Projects Created
           └─ Team assigned
                    │
        ┌───────────┴───────────┐
        │                       │
    Click "Create"      Click "View"
        │                   │
        ▼                   ▼
  CustomProject      CustomProject
  Dialog opens       Detail opens
        │                   │
   Fill Form:         See Details:
   ├─ Title          ├─ Project name
   ├─ Select         ├─ Teams involved
   │ departments     ├─ Progress bar
   ├─ Details        ├─ All tasks
   └─ Submit          ├─ Task status
                      ├─ Comments
                      └─ Edit/Delete
                          options
        │
        ▼
    Success Toast!
    Project appears
    in overview
        │
        ▼
    Employees see
    in their
    ProjectsPreview
        │
        ▼
    They start
    working on it
```

---

## 7️⃣ HR Dashboard Flow

```
       HR OPENS APP
           │
           ▼
    HRDashboard.jsx (Company Dashboard)
           │
    ┌──────┼──────┬──────┬──────┬────────┐
    │      │      │      │      │        │
    ▼      ▼      ▼      ▼      ▼        ▼
   📊     👥     📁     📋     📈      💬
  Stats  Employees Projects Reports  Project Team
         │      │       │    Progress Chat
         │      │       │    │
    ┌────┴──┐   │       │    │
    │       │   │       │    │
   📑      👤   │       │    │
  Click  Employee       │    │
  Tabs  Details  ├─ All Projects│
    │       │       ├─ Status    │
    │       │       ├─ Progress  │
    │       │       ├─ Team      │
    │       │       └─ Deadline  │
    │       │                    │
    │       └─ Attendance        │
    │           ├─ Check in time│
    │           ├─ Check out time
    │           ├─ Total hours
    │           └─ Break time
    │
    ├─ Employee Mgmt Tab
    │   ├─ View all employees
    │   ├─ Add new employee
    │   ├─ Edit employee
    │   └─ Delete employee
    │
    ├─ Projects Tab
    │   ├─ See all projects
    │   ├─ Filter by status
    │   ├─ View progress
    │   └─ Export reports
    │
    ├─ Reports Tab
    │   ├─ View all submitted reports
    │   ├─ Filter by date
    │   ├─ Approve/Reject
    │   └─ Add comments
    │
    └─ Project Progress Tab
        ├─ Track all project progress
        ├─ See which tasks completed
        ├─ Alert for overdue tasks
        └─ Performance analytics
```

---

## 8️⃣ Data Flow: Submit Work Report

```
                    Employee Views Dashboard
                             │
                             ▼
                    WorkReportForm opens
                             │
                    ┌────────┴────────┐
                    │                 │
                 See Text            See List
                 Area for            of Past
                 Report              Reports
                    │                 │
                    │                 ▼
                    │         UserReportsList
                    │         (Shows previous
                    │          reports)
                    │
                    ▼
             Employee Types Report
             ✍️ "Today I completed..."
                    │
                    ▼
             Clicks "Submit" Button
                    │
      ┌─────────────┴─────────────┐
      │                           │
   Validation                  Validation
   Form empty?                 All good? ✅
      │                           │
   ❌ Yes         ❌ No ────────────┘
      │                           
   Show              ▼
   Message:    Prepare data:
   "Please     ├─ Report text
   enter      ├─ Employee ID
   report"    ├─ Date
                ├─ Timestamp
                └─ Status: "submitted"
                      │
                      ▼
              Send to Backend
              axios.post("/api/reports", data)
                      │
            ┌─────────┴─────────┐
            │                   │
         ✅ Success         ❌ Error
            │                   │
            │                   ▼
            │            Show Red Toast:
            │            "Error: Try again"
            │                   │
            │                   ▼
            │            User can retry
            │            (Form stays filled)
            │
            ▼
     Backend Saves to DB
            │
            ▼
     Response to Frontend
     {"success": true, "reportId": 123}
            │
            ▼
     Frontend Updates State
            │
     ┌──────┼──────┐
     │      │      │
     ▼      ▼      ▼
  Show   Clear  Refresh
  Green  Text   Reports
  Toast  Area   List
     │              │
     │              ▼
     │         Show new report
     │         at top of list
     │
     └──────────┬──────────┘
                │
                ▼
         ✅ Report Successfully
            Submitted!
                │
                ▼
         HR Dashboard sees it
         (in real-time if using
         Socket.io)
                │
                ▼
         HR Manager can
         Review/Approve
```

---

## 9️⃣ Real-time Communication: Socket.io

```
        User A (Employee)              Backend Server              User B (Head)
        Writes message               (Node.js + Socket.io)         Listening
              │                                                          △
              │                                                          │
        Clicks "Send"                                                    │
              │                                                          │
              ▼                                                          │
        "Great work!"                                                    │
         (message ready)                                                 │
              │                                                          │
              │  socket.emit("message", {...})                          │
              ├─────────────────────────────────────►                   │
              │                                                          │
              │                    Backend receives                      │
              │                    Processes message                     │
              │                    Validates sender                      │
              │                    Saves to DB                           │
              │                                                          │
              │                    io.emit("message", {...})             │
              │                    (Broadcast to all users)              │
              │                                  ├─────────────────────►│
              │                                  │                      │
              │                                  │  Frontend updates    │
              │                                  │  Component re-renders│
              │                                  │                      │
              │                                  │                      ▼
              │                                  │            Message appears
              │                                  │            on User B's screen
              │                                  │            ⚡ INSTANTLY!
              │                                  │
        User A sees "Delivered"◄────────────────┤
        message confirmed                       │
              │                                  ├─ Also sent to
              │                                  │  User C (HR)
              │                                  ├─ User D (HR)
              │                                  └─ etc...
              │
         Whole process = < 100ms ⚡
```

---

## 🔟 Authentication & Token Flow

```
         User Logs In
              │
              ▼
      Enter Email & Password
              │
              ▼
      Click "Login" Button
              │
              ▼
    Axios sends request to:
    POST /auth/login
    Body: {email, password}
              │
              ▼
    Backend receives request
              │
      ┌───────┴───────┐
      │               │
   Validate        Check in DB
   Input           User exists?
      │               │
      │        ┌──────┴──────┐
      │        │ ✅ Yes  ❌ No│
      │        │             │
      │        │          Return:
      │        │          {error: "User not found"}
      │        │             │
      │        │             ▼
      │        │        Frontend shows error
      │        │        Red toast
      │        │        User tries again
      │        │
      │   Check Password Correct?
      │        │
      │   ┌────┴────┐
      │   │✅ Yes❌ No│
      │   │         │
      │   │      Return:
      │   │      {error: "Wrong password"}
      │   │         │
      │   │         ▼
      │   │    Red toast error
      │   │    User tries again
      │   │
      │   ▼
      │ ✅ Everything OK!
      │   Generate JWT Token:
      │   header.payload.signature
      │   (Secure, can't be tampered)
      │   │
      │   ├─ payload contains:
      │   │  ├─ User ID
      │   │  ├─ Email
      │   │  ├─ Role (employee/head/hr/ceo)
      │   │  └─ Expiry time (24 hours)
      │   │
      │   ▼
      │ Return to Frontend:
      │ {token: "jwt.token.here", role: "employee"}
      │   │
      └───┼──────────────────┐
          │                  │
          ▼                  ▼
    Save Token to      Redirect to
    localStorage       Dashboard
    (Browser storage)       │
          │                  │
          │             EmployeeCockpit
          │             loads
          │                  │
          ▼                  ▼
    Now, every API    Show welcome
    request includes: message
          │                  │
    headers: {          "Welcome back,
    Authorization:      [Name] 👋"
    "Bearer jwt.token"}
          │
    Backend validates:
    Is token valid?
    Not expired?
    User still active?
          │
      ┌───┴───┐
      │✅ ❌  │
      │       │
      │    ❌ Invalid?
      │       Return: 401 Unauthorized
      │       │
      │       ▼
      │   Frontend clears token
      │   Redirects to login
      │   User logs in again
      │
      ▼
    ✅ Token Valid!
    Process request
    Return data
          │
          ▼
    Frontend updates UI
    with fresh data
```

---

## 1️⃣1️⃣ Component Reusability Map

```
                    SHARED COMPONENTS
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    GlassComp         ToastContext      ProjectsPreview
    (Container)       (Notifications)    (List view)
        │                  │                  │
   Used by:            Used by:           Used by:
   ├─ All              ├─ Login           ├─ Employee
   │  Dashboards       ├─ Signup          │  Dashboard
   ├─ Dialogs          ├─ All forms       ├─ Head
   ├─ Cards            ├─ API calls       │  Dashboard
   └─ Layouts          └─ Success/        ├─ HR
                           errors         │  Dashboard
                                          └─ Multiple
        ▼                  ▼                pages
    TeamChat           AttendanceWidget  TaskCard
    (Real-time)        (Time tracking)    (Single task)
        │                  │                  │
   Used by:            Used by:           Used by:
   ├─ Head             ├─ Employee        ├─ Project
   │  Dashboard        │  Dashboard       │  Board
   └─ HR               └─ Mainly          ├─ Dashboard
      Dashboard          Employee         ├─ Work Report
                                          │  List
        ▼                  ▼               └─ Multiple
    UserReportsList    WorkReportForm       pages
    (Reports view)     (Submit report)
        │                  │
   Used by:            Used by:
   ├─ Employee         ├─ Employee
   │  Dashboard        │  Dashboard
   ├─ HR               └─ Integrated in
   │  Dashboard        │  WorkReportForm
   └─ Multiple
      pages

        ┌─────────────────┬─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
      Sidebar           Topbar         Dialogs
      (Navigation)    (Header bar)    (Modals)
        │                 │                 │
   Used by:            Used by:         Used by:
   ├─ MainLayout       ├─ All pages     ├─ Create
   └─ Employee           with layout    │  Project
      Layout           │                ├─ Edit
                       └─ Consistent    │  Task
                          across app    ├─ Delete
                                        │  Confirm
                                        └─ More...
```

---

## 1️⃣2️⃣ Development Environment

```
Developer Workflow:

Terminal:
  npm install          ← Install dependencies
      │
      ▼
  npm run dev          ← Start development server
      │                (Hot reload on changes)
      │
      ▼
  http://localhost:5173 ← Open in browser
      │
      ▼
  Make changes to code
  (Save file)
      │
      ▼
  Browser auto-reloads ⚡
  (Vite magic!)
      │
      ▼
  Test your changes
      │
      ▼
  See errors in console (F12)
      │
      ▼
  Fix and repeat
      │
      ▼
  npm run build        ← Build for production
      │
      ▼
  npm run preview      ← Test production build
      │
      ▼
  Deploy to server 🚀
```

---

## 1️⃣3️⃣ App State Management

```
                    APPLICATION STATE
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   Local Component    Global Context      Backend Data
   State              (Shared State)       (Database)
        │                  │                  │
   useState()         ToastContext         Axios API
   useEffect()        (notifications)      Calls
        │                  │                  │
   Example:           Used globally:     Fetched via:
   ├─ Form           Notifications      ├─ GET /api/...
   │ values          ├─ Success         ├─ POST /api/...
   ├─ Modal          ├─ Error           ├─ PUT /api/...
   │ open/close      ├─ Warning         └─ DELETE /api/...
   ├─ Loading        └─ Info                  │
   │ spinner                              Returns:
   ├─ Filters                            ├─ Projects
   ├─ Sorting                            ├─ Tasks
   └─ etc...                             ├─ Reports
                                         ├─ Users
   Only that                             └─ etc...
   component                                │
   needs it                             Stored in
                                        database
                         Component shows this
                         data to user

                    Data Flow:
                    UI → Component State → Display ✅
                    UI → API → Backend → DB → Response → Update UI ✅
```

---

## 1️⃣4️⃣ Security Layers

```
        SECURITY IN ALKOR ERP

Layer 1: AUTHENTICATION (Who are you?)
         │
         ├─ Login form requires email & password
         ├─ Backend validates credentials
         ├─ JWT token generated (secure ID)
         └─ Token stored in browser localStorage
                │
                ▼
Layer 2: AUTHORIZATION (What can you do?)
         │
         ├─ Every API request includes token in headers
         ├─ Backend validates token
         ├─ Backend checks user role:
         │  ├─ Employee can only see own data
         │  ├─ Head can see their department
         │  ├─ HR can see company-wide data
         │  └─ CEO has full access
         └─ If unauthorized → Return 403 error
                │
                ▼
Layer 3: DATA ENCRYPTION
         │
         ├─ Passwords hashed (not stored as plain text)
         ├─ HTTPS/SSL (connection encrypted)
         ├─ JWT tokens signed (can't be forged)
         └─ No sensitive data in localStorage except token
                │
                ▼
Layer 4: VALIDATION
         │
         ├─ Frontend: Check form before sending
         ├─ Backend: Double-check all data
         ├─ Sanitize inputs (prevent injection)
         └─ Rate limiting (prevent attacks)
                │
                ▼
Layer 5: SESSION MANAGEMENT
         │
         ├─ Token expires after 24 hours
         ├─ User must log in again
         ├─ Logout clears localStorage
         └─ Prevents unauthorized access

        If you try to break in:
        ┌──────────────────────────────────────┐
        │                                      │
        ├─ Wrong credentials → Login fails ❌  │
        ├─ Invalid token → API call fails ❌   │
        ├─ Wrong role → Access denied ❌       │
        ├─ Expired token → Redirected to login │
        └─ Not authenticated → No access ❌    │
```

---

## Summary: How Everything Connects

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE FLOW                                   │
└─────────────────────────────────────────────────────────────────────────┘

User Opens Browser
      │
      ▼
  React App Loads
  (From Vite dev server)
      │
      ▼
  App.jsx renders
  (Main component)
      │
      ├─ Router setup (Navigation)
      ├─ ToastProvider wraps app (Notifications)
      ├─ ThemeProvider applies theme
      └─ Material-UI initialized
      │
      ▼
  Show Login Page
  (Login.jsx)
      │
      ▼
  User enters credentials
  & clicks Login
      │
      ├─ Validation check ✓
      ├─ Axios sends to backend
      ├─ Backend validates
      ├─ If valid → Returns JWT token
      └─ Stores token in localStorage
      │
      ▼
  User redirected to Dashboard
  (based on role)
      │
      ├─ Employee → EmployeeCockpit.jsx
      ├─ Head → Head.jsx
      └─ HR → HRDashboard.jsx
      │
      ▼
  Dashboard Components load
      │
      ├─ Fetch initial data (API calls)
      ├─ Display components
      ├─ Show layouts (Sidebar, Topbar)
      └─ Ready for interaction
      │
      ▼
  User Interacts (Click, Submit Form, etc)
      │
      ├─ Component state updates
      ├─ UI re-renders
      ├─ API call made if needed
      ├─ Backend processes
      └─ Response updates component
      │
      ├─ Show toast notification
      ├─ Refresh data if needed
      └─ Real-time chat via Socket.io
      │
      ▼
  User stays in app until logout
  (All data persists in component state)
      │
      ▼
  User clicks Logout
      │
      ├─ Clear localStorage
      ├─ Clear component state
      └─ Redirect to login
      │
      ▼
  Back to Login Page
  (Cycle repeats)
```

---

**Created:** May 2026  
**Visual Diagrams Version:** 1.0

