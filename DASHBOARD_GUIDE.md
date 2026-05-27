# 📊 Alkor ERP - Detailed Dashboard Guide

**Complete Guide to Each Dashboard with Examples & Workflows**

---

## 🎓 Understanding the Three Dashboards

The Alkor ERP system has **3 main dashboards**, each designed for different users:

```
┌──────────────────────────────────────────────────────────┐
│                 ALKOR ERP DASHBOARDS                     │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  1️⃣ EMPLOYEE DASHBOARD                                   │
│     (For: Regular Employees)                             │
│     (File: EmployeeCockpit.jsx)                          │
│     (Purpose: Track work & submit reports)              │
│                                                           │
│  2️⃣ HEAD DASHBOARD                                       │
│     (For: Department Heads/Managers)                     │
│     (File: Head.jsx)                                     │
│     (Purpose: Manage team & projects)                    │
│                                                           │
│  3️⃣ HR DASHBOARD                                         │
│     (For: Human Resources Managers)                      │
│     (File: HRDashboard.jsx)                              │
│     (Purpose: Oversee all employees & projects)          │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 1️⃣ EMPLOYEE DASHBOARD - Complete Guide

### 📍 Location & Entry
```
File: src/pages/Employee/EmployeeCockpit.jsx
URL: /app/employee (after login)
Access: Any employee user
Components Inside:
  ├─ AttendanceWidget
  ├─ ProjectsPreview
  ├─ WorkReportForm
  ├─ UserReportsList (inside WorkReportForm)
  ├─ TeamChat
  └─ Layout (Sidebar + Topbar)
```

### 👤 What Employee Sees

```
┌─────────────────────────────────────────────────────────────┐
│                   EMPLOYEE DASHBOARD                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  HEADER:                                                    │
│  Welcome back, John Doe 👋  |  [Settings] [Logout]         │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SECTION 1: ATTENDANCE TRACKING                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  📅 Current Date: 27 May 2026                        │  │
│  │  🕐 Current Time: 09:30 AM                           │  │
│  │                                                      │  │
│  │  STATUS: ⏸️ NOT PUNCHED IN                          │  │
│  │                                                      │  │
│  │  [PUNCH IN 🚪] [BREAK ☕] [PUNCH OUT 🚪]           │  │
│  │                                                      │  │
│  │  Active Projects Today: 3                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SECTION 2: MY ASSIGNED PROJECTS                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PROJECT 1: Website Redesign         [ACTIVE] 60%   │  │
│  │  ├─ Team: Web Dev Team                              │  │
│  │  ├─ Due: 15 June 2026                               │  │
│  │  └─ My Tasks: 5 / 8 completed                       │  │
│  │     [VIEW DETAILS →]                                │  │
│  │                                                      │  │
│  │  PROJECT 2: Mobile App              [PENDING] 0%    │  │
│  │  ├─ Team: Mobile Dev Team                           │  │
│  │  ├─ Due: 30 June 2026                               │  │
│  │  └─ My Tasks: Not started                           │  │
│  │     [VIEW DETAILS →]                                │  │
│  │                                                      │  │
│  │  PROJECT 3: Bug Fixes              [COMPLETED] 100% │  │
│  │  ├─ Team: QA Team                                   │  │
│  │  ├─ Completed: 20 May 2026                          │  │
│  │  └─ My Tasks: 3 / 3 completed                       │  │
│  │     [VIEW DETAILS →]                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SECTION 3: SUBMIT DAILY WORK REPORT                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  What did you accomplish today?                     │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │                                              │  │  │
│  │  │ Today I completed:                           │  │  │
│  │  │ • Fixed bug in login page                    │  │  │
│  │  │ • Reviewed pull requests from team           │  │  │
│  │  │ • Updated database schema                    │  │  │
│  │  │                                              │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  │                                              [SUBMIT] │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SECTION 4: MY SUBMITTED REPORTS                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  📋 REPORT 1 - 26 May 2026                          │  │
│  │  "Fixed critical bug in payment system"            │  │
│  │  Status: ✅ APPROVED by Head                        │  │
│  │  [EDIT] [DELETE]                                   │  │
│  │                                                      │  │
│  │  📋 REPORT 2 - 25 May 2026                          │  │
│  │  "Implemented new search feature"                   │  │
│  │  Status: ⏳ PENDING review                          │  │
│  │  [EDIT] [DELETE]                                   │  │
│  │                                                      │  │
│  │  📋 REPORT 3 - 24 May 2026                          │  │
│  │  "Updated documentation"                           │  │
│  │  Status: ❌ REJECTED (Needs more detail)            │  │
│  │  [EDIT] [DELETE]                                   │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SECTION 5: TEAM CHAT                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  💬 TEAM CHANNEL                                    │  │
│  │                                                      │  │
│  │  Sarah: "Anyone free for code review?"             │  │
│  │  9:15 AM                                            │  │
│  │                                                      │  │
│  │  You: "Sure! Send me the PR"                        │  │
│  │  9:18 AM                                            │  │
│  │                                                      │  │
│  │  Mike: "Thanks! Check it out"                       │  │
│  │  9:20 AM                                            │  │
│  │                                                      │  │
│  │  [Type message...]  [Send] 📤                       │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 Employee Workflows

#### Workflow 1: Start Work Day

```
STEP 1: Employee Opens Dashboard
  └─ See "PUNCH IN" button in AttendanceWidget
     └─ Shows current time & date

STEP 2: Employee Clicks "PUNCH IN 🚪"
  └─ Button sends API request to backend
     └─ Backend records:
        ├─ Employee ID
        ├─ Punch In Time
        ├─ Location (if available)
        └─ Status: "working"

STEP 3: Frontend Updates
  └─ Green notification: "Punched in at 09:00 AM"
  └─ Button changes to "BREAK ☕" & "PUNCH OUT 🚪"
  └─ Status changes to: "⏱️ WORKING"
  └─ Timer starts showing elapsed time

STEP 4: Employee Works
  └─ Can:
     ├─ View assigned projects
     ├─ View tasks in ProjectsPreview
     ├─ Click project to see details
     └─ Update task status
```

#### Workflow 2: Submit Daily Report

```
STEP 1: Employee Fills WorkReportForm
  └─ Click text area
     └─ Type: "Today I completed..."
        ├─ Fixed login bugs
        ├─ Reviewed code
        └─ Updated README

STEP 2: Employee Clicks "SUBMIT" Button
  └─ Frontend validates (not empty)
     └─ Axios sends POST request:
        {
          reportText: "Today I completed...",
          employeeId: 123,
          date: "2026-05-27",
          status: "submitted"
        }

STEP 3: Backend Processing
  └─ Saves to database
     └─ Notifies Head & HR
        └─ Returns success

STEP 4: Frontend Updates
  └─ Green toast: "Report submitted successfully! ✅"
  └─ Text area clears
  └─ New report appears at top of "MY SUBMITTED REPORTS"
     └─ Shows date, text, status "⏳ PENDING review"

STEP 5: Head Reviews
  └─ Sees report in their dashboard
     └─ Can:
        ├─ Read report
        ├─ Click "APPROVE" → Status changes to "✅ APPROVED"
        └─ Click "REJECT" → Ask for revisions
```

#### Workflow 3: End Work Day

```
STEP 1: Employee Takes Break
  └─ Clicks "BREAK ☕" button
     └─ Timer pauses
     └─ Tracks break duration

STEP 2: Employee Returns from Break
  └─ Clicks "BREAK ☕" again or "Back to Work"
     └─ Timer resumes
     └─ Adds break time to total

STEP 3: Employee Ready to Leave
  └─ Clicks "PUNCH OUT 🚪" button
     └─ Backend records:
        ├─ Punch Out Time
        ├─ Total Work Hours
        ├─ Total Break Time
        └─ Status: "offline"

STEP 4: Frontend Shows Summary
  └─ Green notification: "Punched out at 5:30 PM"
  └─ Shows:
     ├─ Total Work Hours: 8:00
     ├─ Total Break Time: 0:45
     └─ Net Work Time: 7:15

STEP 5: Data Saved
  └─ Attendance record created
     └─ HR can see this in their dashboard
        └─ Used for payroll & analytics
```

#### Workflow 4: View Project Details

```
STEP 1: Employee Sees ProjectsPreview
  └─ Lists all assigned projects
     └─ Shows: Name, Status, Progress %

STEP 2: Employee Clicks "VIEW DETAILS →"
  └─ Navigates to ProjectDetailView.jsx
     └─ Shows full project information:
        ├─ Project title & description
        ├─ Team members assigned
        ├─ All tasks in the project
        ├─ Deadline
        ├─ Overall progress
        └─ Comments section

STEP 3: Employee Can Update Task Status
  └─ For each task, can click on it
     └─ Options:
        ├─ Mark as "In Progress"
        ├─ Mark as "Completed"
        ├─ Add comment
        └─ Ask for help

STEP 4: Head Sees Update
  └─ In real-time (if using Socket.io)
     └─ Or when they refresh dashboard
        └─ Project progress updates
```

### 📱 Key Features of Employee Dashboard

| Feature | What It Does | How to Use |
|---------|-------------|-----------|
| **Attendance Widget** | Track time | Click punch in/out buttons |
| **Projects Preview** | See assigned work | Click to view project details |
| **Work Report Form** | Submit daily work | Type and click submit |
| **Reports List** | View past reports | See status (approved/rejected/pending) |
| **Team Chat** | Talk with team | Real-time messages |
| **Sidebar** | Navigate app | Click menu items |
| **Topbar** | User menu & logout | Click profile icon |

---

## 2️⃣ HEAD DASHBOARD - Complete Guide

### 📍 Location & Entry
```
File: src/pages/admin-side/Head.jsx
URL: /head (after login with head role)
Access: Department Head users only
Components Inside:
  ├─ CustomProjectDialog
  ├─ CustomProjectsList
  ├─ HeadProjectView
  ├─ HeadProjectOverview
  ├─ ProjectsPreview
  ├─ TeamChat
  ├─ StatCards (metrics)
  └─ Layout (Sidebar + Topbar)
```

### 👤 What Head Sees

```
┌─────────────────────────────────────────────────────────────┐
│                     HEAD DASHBOARD                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  HEADER:                                                    │
│  Department Head Dashboard | Sarah Johnson  |  [Logout]    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  QUICK STATS:                                               │
│  ┌─────────────┬──────────┬──────────┬──────────────┐      │
│  │ Tasks Total │ Active   │ Pending  │ Completed    │      │
│  │     15      │    6     │    5     │      4       │      │
│  └─────────────┴──────────┴──────────┴──────────────┘      │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ACTION BUTTONS:                                            │
│  [+ CREATE NEW TASK]  [+ CREATE PROJECT]  [📋 OVERVIEW]   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SECTION 1: MY PROJECTS                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  📁 Website Redesign             [ACTIVE] 60%       │  │
│  │  ├─ Teams: Design, Development, QA                  │  │
│  │  ├─ Status: In Progress                             │  │
│  │  ├─ Start: 15 April 2026                            │  │
│  │  ├─ Deadline: 15 June 2026                          │  │
│  │  ├─ Assigned: 12 employees                          │  │
│  │  └─ [VIEW DETAILS] [EDIT] [DELETE]                  │  │
│  │                                                      │  │
│  │  📁 Mobile App Development      [PENDING] 0%        │  │
│  │  ├─ Teams: Mobile Dev, QA                           │  │
│  │  ├─ Status: Not Started                             │  │
│  │  ├─ Start: 01 June 2026                             │  │
│  │  ├─ Deadline: 30 July 2026                          │  │
│  │  ├─ Assigned: 8 employees                           │  │
│  │  └─ [VIEW DETAILS] [EDIT] [DELETE]                  │  │
│  │                                                      │  │
│  │  📁 Bug Fixes                  [COMPLETED] 100%      │  │
│  │  ├─ Teams: QA, Development                          │  │
│  │  ├─ Status: Completed                               │  │
│  │  ├─ Completed: 20 May 2026                          │  │
│  │  ├─ Assigned: 6 employees                           │  │
│  │  └─ [VIEW DETAILS] [ARCHIVE]                        │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SECTION 2: CREATE NEW TASK (FORM)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  Title: [_________________________]                 │  │
│  │                                                      │  │
│  │  Priority:  ▼ Medium                                │  │
│  │                                                      │  │
│  │  Deadline: [27/05/2026________]                     │  │
│  │                                                      │  │
│  │  Description:                                       │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │                                              │  │  │
│  │  │ (Describe the task here...)                  │  │  │
│  │  │                                              │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  │                                              [SAVE] │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SECTION 3: TEAM COMMUNICATION                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  💬 TEAM CHAT                                        │  │
│  │                                                      │  │
│  │  You: "Meeting at 2 PM - discuss project status"    │  │
│  │  2:15 PM                                             │  │
│  │                                                      │  │
│  │  John: "I'll be there!"                             │  │
│  │  2:17 PM                                             │  │
│  │                                                      │  │
│  │  Sarah: "Completed my tasks early ✓"                │  │
│  │  2:19 PM                                             │  │
│  │                                                      │  │
│  │  [Type message...]  [Send] 📤                       │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 Head Workflows

#### Workflow 1: Create New Custom Project

```
STEP 1: Head Clicks "[+ CREATE PROJECT]" Button
  └─ CustomProjectDialog Modal opens
     └─ Shows form to fill

STEP 2: Head Fills Project Details
  ├─ Project Title: "Website Redesign"
  ├─ Select Departments:
  │  └─ Check: "IT", "Design", "QA"
  ├─ Deadline: "15 June 2026"
  └─ Description: "Redesign entire company website"

STEP 3: Head Clicks "CREATE PROJECT"
  └─ Frontend validates all fields
     └─ Axios sends POST to backend:
        {
          projectTitle: "Website Redesign",
          departments: [
            {departmentId: 1, departmentName: "IT"},
            {departmentId: 2, departmentName: "Design"},
            {departmentId: 3, departmentName: "QA"}
          ],
          deadline: "2026-06-15",
          description: "...",
          createdBy: headId
        }

STEP 4: Backend Creates Project
  └─ Saves to database
     └─ Creates initial tasks
     └─ Sends notifications to department heads
        └─ Returns project ID

STEP 5: Frontend Updates
  └─ Green toast: "Project created successfully! ✅"
  └─ Modal closes
  └─ New project appears in "MY PROJECTS" list
     └─ Status: "Pending" (waiting for dept heads to accept)

STEP 6: Other Heads See It
  └─ In their HRDashboard or HeadProjectOverview
     └─ Can:
        ├─ Accept the project
        ├─ Reject with reason
        └─ Request modifications
```

#### Workflow 2: Create Task Within Project

```
STEP 1: Head Clicks Project → "VIEW DETAILS"
  └─ HeadProjectView opens
     └─ Shows all tasks in project
     └─ Shows "Add Task" button at bottom

STEP 2: Head Clicks "Add Task"
  └─ Task creation form appears
     ├─ Task Title: "Design landing page mockup"
     ├─ Assigned To: [Select employee from dropdown]
     ├─ Priority: [Select from dropdown]
     ├─ Deadline: [Date picker]
     └─ Description: [Text area]

STEP 3: Head Fills and Submits
  └─ Axios POST request to backend:
     {
       taskTitle: "Design landing page mockup",
       projectId: 123,
       assignedTo: 456,  // Employee ID
       priority: "High",
       deadline: "2026-05-31",
       description: "..."
     }

STEP 4: Backend Saves & Notifies
  └─ Task created in database
     └─ Employee gets notification:
        "New task assigned: Design landing page mockup"
     └─ Task appears in their dashboard

STEP 5: Frontend Shows
  └─ Green toast: "Task created ✅"
  └─ New task appears in project task list
     └─ Status: "Pending"
     └─ Shows assigned employee
```

#### Workflow 3: Monitor Project Progress

```
STEP 1: Head Clicks "PROJECT OVERVIEW"
  └─ HeadProjectOverview page loads
     └─ Shows all projects created by head
     └─ Shows progress for each

STEP 2: Head Sees:
  ├─ Project Name & Status
  ├─ Progress Bar (% complete)
  ├─ Number of tasks:
  │  ├─ Total tasks
  │  ├─ Completed tasks
  │  └─ Pending tasks
  ├─ Team members assigned
  ├─ Deadline approaching? 🚨
  └─ [VIEW] [EDIT] [DELETE] buttons

STEP 3: Head Clicks "VIEW" on Project
  └─ Full project details page
     └─ Can see:
        ├─ All tasks with status
        ├─ Who's assigned to each
        ├─ Progress of each task
        ├─ Comments from team
        ├─ Attachments/files
        └─ Timeline view

STEP 4: Head Can Take Action
  └─ For tasks not progressing:
     ├─ Send reminder to employee
     ├─ Change deadline if needed
     ├─ Reassign to another employee
     └─ Mark as blocked/urgent

STEP 5: Real-Time Updates
  └─ As employees complete tasks:
     └─ Progress bar updates automatically
        └─ Head can see in real-time (if Socket.io used)
        └─ Or after refresh
```

#### Workflow 4: Approve Employee Reports

```
STEP 1: Employees Submit Work Reports
  └─ Each employee submits daily report
     └─ Report goes to their Head

STEP 2: Head Sees Notification
  └─ Alert: "3 new work reports to review"
  └─ Or visible in dashboard

STEP 3: Head Reviews Reports
  └─ Can see:
     ├─ Employee name
     ├─ Report date
     ├─ What they accomplished
     ├─ Time spent
     └─ Comments field for feedback

STEP 4: Head Takes Action
  └─ Option 1: APPROVE ✅
     ├─ Marks as "Approved"
     ├─ Employee notified
     └─ Report goes to HR for final review
  
  └─ Option 2: REJECT ❌
     ├─ Add reason: "Need more details"
     ├─ Employee notified
     └─ Employee can edit & resubmit
  
  └─ Option 3: ADD COMMENT
     ├─ "Great work on the bug fixes!"
     ├─ Employee sees feedback
     └─ Keep report in pending

STEP 5: Reports Flow to HR
  └─ Approved reports go to HR Dashboard
     └─ HR reviews for company-wide insights
```

### 📋 Key Features of Head Dashboard

| Feature | What It Does | How to Use |
|---------|-------------|-----------|
| **Create Project** | Start new project | Click [+ CREATE PROJECT] button |
| **Create Task** | Assign work | Click project > Add Task |
| **My Projects** | See all projects | Shows title, status, progress |
| **Project Details** | View full info | Click [VIEW DETAILS] |
| **Approve Reports** | Review employee work | Click report > Approve/Reject |
| **Team Chat** | Communicate | Real-time messaging |
| **Project Overview** | Track progress | See all metrics at once |
| **Quick Stats** | See metrics at a glance | Cards showing totals |

---

## 3️⃣ HR DASHBOARD - Complete Guide

### 📍 Location & Entry
```
File: src/pages/admin-side/HRDashboard.jsx
URL: /hr-dashboard (after login with hr role)
Access: HR users only
Components Inside:
  ├─ StatCards (dashboard metrics)
  ├─ EmployeeManager
  ├─ AttendanceManager
  ├─ ReportManager
  ├─ ProjectsPreview
  ├─ HRProjectProgress
  ├─ UserReportsList
  ├─ TeamChat
  └─ Tabs navigation
```

### 👤 What HR Sees

```
┌─────────────────────────────────────────────────────────────┐
│                      HR DASHBOARD                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  HEADER:                                                    │
│  HR Management Portal | Mike Smith  |  [Logout]            │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  KEY METRICS (At a Glance):                                 │
│  ┌──────────┬──────────┬──────────┬─────────────┐           │
│  │ 👥       │ 📁       │ ✅       │ 📊          │           │
│  │ Total    │ Total    │ Completed│ Active      │           │
│  │ Employees│ Projects │ Tasks    │ Projects    │           │
│  │   125    │    23    │   156    │      8      │           │
│  └──────────┴──────────┴──────────┴─────────────┘           │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TABS (Click to switch):                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [EMPLOYEES] [PROJECTS] [REPORTS] [ATTENDANCE] [PROGRESS] │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TAB CONTENT: EMPLOYEES                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  [+ ADD NEW EMPLOYEE]  [Search...] [Filter ▼]      │  │
│  │                                                      │  │
│  │  ┌─ John Doe          | john@company.com │ IT    │  │  │
│  │  │  Employee #001     | Joined: 01 Jan 2023       │  │  │
│  │  │  [VIEW] [EDIT] [DELETE]                        │  │  │
│  │  │                                                  │  │  │
│  │  ├─ Sarah Johnson     | sarah@company.com │ Design│  │  │
│  │  │  Employee #002     | Joined: 15 Mar 2023       │  │  │
│  │  │  [VIEW] [EDIT] [DELETE]                        │  │  │
│  │  │                                                  │  │  │
│  │  ├─ Mike Williams     | mike@company.com  │ QA    │  │  │
│  │  │  Employee #003     | Joined: 10 May 2023       │  │  │
│  │  │  [VIEW] [EDIT] [DELETE]                        │  │  │
│  │  │                                                  │  │  │
│  │  └─ More employees...                              │  │  │
│  │                                                      │  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TAB CONTENT: PROJECTS                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  📁 Website Redesign          [ACTIVE] 60%          │  │
│  │  ├─ Head: Sarah Johnson (Design)                    │  │
│  │  ├─ Team Size: 12 employees                         │  │
│  │  ├─ Deadline: 15 June 2026                          │  │
│  │  ├─ Progress: 60% complete                          │  │
│  │  └─ [VIEW] [EDIT] [DETAILS]                         │  │
│  │                                                      │  │
│  │  📁 Mobile App Development   [PENDING] 0%           │  │
│  │  ├─ Head: John Doe (IT)                             │  │
│  │  ├─ Team Size: 8 employees                          │  │
│  │  ├─ Deadline: 30 July 2026                          │  │
│  │  ├─ Progress: Not started                           │  │
│  │  └─ [VIEW] [EDIT] [DETAILS]                         │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TAB CONTENT: REPORTS                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  Filter: [Date Range ▼] [Department ▼] [Status ▼]  │  │
│  │                                                      │  │
│  │  📋 From: John Doe | Date: 26 May 2026             │  │
│  │  "Fixed bug in payment system"                      │  │
│  │  Status: ✅ APPROVED (by Head Sarah)                │  │
│  │  [VIEW] [EXPORT]                                   │  │
│  │                                                      │  │
│  │  📋 From: Sarah Johnson | Date: 26 May 2026        │  │
│  │  "Completed UI mockups for landing page"            │  │
│  │  Status: ⏳ PENDING (waiting for head review)       │  │
│  │  [APPROVE] [REJECT] [REQUEST DETAILS]              │  │
│  │                                                      │  │
│  │  📋 From: Mike Williams | Date: 25 May 2026        │  │
│  │  "Tested new features"                              │  │
│  │  Status: ❌ REJECTED (by Head - needs more detail)   │  │
│  │  [VIEW] [ARCHIVE]                                  │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TAB CONTENT: ATTENDANCE                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  Select Date Range: [From: _____] [To: _____] [GO]  │  │
│  │  Select Employee: [Search employee...]             │  │
│  │                                                      │  │
│  │  📊 Attendance Report for: John Doe (May 2026)     │  │
│  │                                                      │  │
│  │  Date    | In Time  | Out Time | Hours | Status   │  │
│  │  ─────────────────────────────────────────────────  │  │
│  │  1 May   | 9:00 AM  | 5:30 PM  | 8:00  | ✅ OK    │  │
│  │  2 May   | 9:15 AM  | 5:45 PM  | 8:00  | ✅ OK    │  │
│  │  3 May   | 9:05 AM  | 6:00 PM  | 8:45  | ✅ OK    │  │
│  │  4 May   | 10:30 AM | 5:00 PM  | 6:30  | ⚠️  LATE  │  │
│  │                                                      │  │
│  │  Monthly Summary:                                   │  │
│  │  ├─ Total Work Days: 22                             │  │
│  │  ├─ Present: 22                                     │  │
│  │  ├─ Absent: 0                                       │  │
│  │  ├─ Late: 2 times                                   │  │
│  │  └─ Average Hours: 8.2 hrs/day                      │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TAB CONTENT: PROJECT PROGRESS                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  Project Status Overview                            │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │ Website Redesign                   60%     │   │  │
│  │  │ ████████████████░░░░░░░░░░░░      ACTIVE  │   │  │
│  │  │ Tasks: 12/20 completed                      │   │  │
│  │  │ Deadline: 15 June 2026                      │   │  │
│  │  │                                             │   │  │
│  │  │ Mobile App Development           0%        │   │  │
│  │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ PENDING    │   │  │
│  │  │ Tasks: 0/18 completed                       │   │  │
│  │  │ Deadline: 30 July 2026                      │   │  │
│  │  │                                             │   │  │
│  │  │ Bug Fixes                        100%       │   │  │
│  │  │ ████████████████████░░░░░░ COMPLETED        │   │  │
│  │  │ Tasks: 15/15 completed                      │   │  │
│  │  │ Completed: 20 May 2026                      │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                                                      │  │
│  │  🚨 Alerts:                                         │  │
│  │  • Website Redesign: 3 tasks overdue                │  │
│  │  • Mobile App: Not started (starts 1 June)          │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  💬 TEAM COMMUNICATION CORNER                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Message from Sarah (Head - Design):                │  │
│  │  "Website mockups ready for review"                 │  │
│  │  10:30 AM                                            │  │
│  │                                                      │  │
│  │  Your message:                                      │  │
│  │  "Great! I'll review today"                         │  │
│  │  10:32 AM                                            │  │
│  │                                                      │  │
│  │  [Type message...]  [Send] 📤                       │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 HR Workflows

#### Workflow 1: View & Manage All Employees

```
STEP 1: HR Clicks "EMPLOYEES" Tab
  └─ EmployeeManager component loads
     └─ Shows list of all employees
        ├─ Name, email, department
        ├─ Join date
        ├─ Employee ID
        └─ [VIEW] [EDIT] [DELETE] buttons

STEP 2: HR Can Search/Filter
  └─ Search by name/email
     └─ Filter by department
        └─ Sort by join date, status, etc.

STEP 3: HR Clicks "ADD NEW EMPLOYEE"
  └─ Form appears with fields:
     ├─ Full Name
     ├─ Email
     ├─ Department (dropdown)
     ├─ Role (Employee/Head)
     ├─ Phone
     └─ Address

STEP 4: HR Submits Form
  └─ Backend creates new employee
     └─ Sets initial password
     └─ Employee gets email to activate account
        └─ Employee can login after activation

STEP 5: HR Clicks "EDIT" on Employee
  └─ Can modify:
     ├─ Department
     ├─ Role
     ├─ Permissions
     └─ Contact info

STEP 6: HR Clicks "DELETE" on Employee
  └─ Confirmation dialog appears
     └─ If confirmed:
        ├─ Employee marked as inactive
        ├─ Can't login anymore
        └─ Records kept for history
```

#### Workflow 2: Review Work Reports

```
STEP 1: HR Clicks "REPORTS" Tab
  └─ ReportManager component loads
     └─ Shows all submitted reports
        ├─ From which employee
        ├─ Report date
        ├─ What they accomplished
        └─ Current status

STEP 2: HR Filters Reports
  └─ By date range: Show May reports
     └─ By status:
        ├─ Pending (not reviewed yet)
        ├─ Approved (head approved)
        └─ Rejected (head rejected)
     └─ By department

STEP 3: HR Reviews Individual Report
  └─ Clicks on report
     └─ Reads full content
     └─ Can see:
        ├─ Head's approval status
        ├─ Head's comments
        ├─ Attachment files
        └─ Time spent noted

STEP 4: HR Can:
  └─ Option 1: APPROVE FINAL ✅
     ├─ Mark as "Approved"
     ├─ Goes to payroll system
     └─ Employee gets notification
  
  └─ Option 2: REQUEST CHANGES
     ├─ Add message: "Need more details"
     ├─ Goes back to head for review
     └─ Head notified
  
  └─ Option 3: ARCHIVE
     ├─ Moves to archive
     └─ Not counted in current metrics

STEP 5: Generate Report
  └─ Can export all reports for a period
     └─ Useful for:
        ├─ Payroll processing
        ├─ Performance analysis
        ├─ Company statistics
        └─ Compliance records
```

#### Workflow 3: Track Attendance

```
STEP 1: HR Clicks "ATTENDANCE" Tab
  └─ AttendanceManager component loads
     └─ Shows attendance tracking interface

STEP 2: HR Selects Date Range & Employee
  └─ Date Range: 1 May - 31 May 2026
     └─ Employee: John Doe (dropdown)
        └─ Or leave blank for all employees

STEP 3: View Attendance Report
  └─ Shows for each day:
     ├─ Punch In Time
     ├─ Punch Out Time
     ├─ Total Hours Worked
     ├─ Status (On Time / Late / Absent)
     └─ Break duration

STEP 4: Monthly Summary
  └─ HR can see:
     ├─ Total working days
     ├─ Days present
     ├─ Days absent
     ├─ Times late
     ├─ Total hours worked
     └─ Average hours per day

STEP 5: Generate Attendance Report
  └─ Can export as PDF/Excel
     └─ Useful for:
        ├─ Payroll calculation
        ├─ Performance review
        ├─ Identifying issues
        ├─ Compliance
        └─ Management reports
```

#### Workflow 4: Monitor Project Progress

```
STEP 1: HR Clicks "PROJECT PROGRESS" Tab
  └─ HRProjectProgress component loads
     └─ Shows all projects company-wide

STEP 2: HR Sees Project Status
  └─ For each project:
     ├─ Project name
     ├─ Project head
     ├─ Progress bar (%)
     ├─ Tasks completed vs total
     ├─ Team size
     ├─ Deadline
     └─ Status: On Track / At Risk / Overdue

STEP 3: Identify Problems
  └─ HR can spot:
     ├─ Projects falling behind
     ├─ Overdue tasks
     ├─ Unassigned work
     ├─ Resource conflicts
     └─ Team member overload

STEP 4: Take Action
  └─ Contact head about problem
     └─ Reallocate resources
     └─ Extend deadline if needed
     └─ Add more team members

STEP 5: Generate Analytics
  └─ Can see trends:
     ├─ Which projects finish on time
     ├─ Which teams are most efficient
     ├─ Common delays
     └─ Performance metrics

STEP 6: Strategic Planning
  └─ Use insights for:
     ├─ Resource planning
     ├─ Team training needs
     ├─ Process improvements
     └─ Future project planning
```

### 📋 Key Features of HR Dashboard

| Feature | What It Does | How to Use |
|---------|-------------|-----------|
| **Employees Tab** | Manage all employees | View, add, edit, delete |
| **Projects Tab** | See all company projects | View status & progress |
| **Reports Tab** | Review work reports | Approve or request changes |
| **Attendance Tab** | Track employee hours | View daily records & monthly summary |
| **Progress Tab** | Monitor all projects | Identify issues early |
| **Stat Cards** | Quick metrics | See totals at a glance |
| **Team Chat** | Company-wide communication | Real-time messaging |
| **Filters & Search** | Find specific data | By date, department, status |

---

## 🎯 Summary Comparison

### All Three Dashboards at a Glance

```
┌─────────────┬──────────────────┬──────────────────┬──────────────────┐
│ Feature     │  EMPLOYEE        │  HEAD            │  HR              │
├─────────────┼──────────────────┼──────────────────┼──────────────────┤
│ Purpose     │ Track personal   │ Manage team &    │ Oversee all      │
│             │ work & time      │ projects         │ employees        │
├─────────────┼──────────────────┼──────────────────┼──────────────────┤
│ Can See     │ My data only     │ Dept data        │ Company-wide     │
├─────────────┼──────────────────┼──────────────────┼──────────────────┤
│ Main        │ • Punch in/out   │ • Create         │ • All employees  │
│ Actions     │ • Submit reports │   projects       │ • All projects   │
│             │ • View projects  │ • Create tasks   │ • All reports    │
│             │ • Chat           │ • Approve        │ • Attendance     │
│             │                  │   reports        │ • Analytics      │
│             │                  │ • Chat           │ • Chat           │
├─────────────┼──────────────────┼──────────────────┼──────────────────┤
│ Data Access │ Self             │ Department       │ Company          │
├─────────────┼──────────────────┼──────────────────┼──────────────────┤
│ Main        │ AttendanceWidget │ CustomProject    │ StatCards        │
│ Components  │ ProjectsPreview  │ Dialog           │ EmployeeManager  │
│             │ WorkReportForm   │ HeadProjectView  │ ReportManager    │
│             │ UserReportsList  │ TeamChat         │ AttendanceManager│
│             │ TeamChat         │ StatCards        │ HRProjectProgress│
├─────────────┼──────────────────┼──────────────────┼──────────────────┤
│ Key         │ Report work      │ Project          │ Company          │
│ Workflows   │ Track time       │ management       │ analytics        │
│             │ Update tasks     │ Task assignment  │ Resource mgmt    │
│             │ Collaborate      │ Report approval  │ Performance      │
└─────────────┴──────────────────┴──────────────────┴──────────────────┘
```

---

## 🔗 How Dashboards Connect

```
        EMPLOYEE Dashboard
              │
              │ Submits work report
              │ Updates task status
              │ Tracks time
              │
              ▼
        HEAD Dashboard
              │
              │ Reviews report ✅
              │ Approves/Rejects
              │ Monitors project progress
              │
              ▼
        HR Dashboard
              │
              │ Sees final approved reports
              │ Tracks company-wide metrics
              │ Analyzes all projects
              │ Plans resources
              │
              ▼
        INSIGHTS & DECISIONS
        for company strategy
```

---

**Created:** May 2026  
**Dashboard Guide Version:** 1.0

