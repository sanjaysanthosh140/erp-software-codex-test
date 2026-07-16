import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { ToastProvider } from "./context/ToastContext";
import GlobalNotifications from "./components/GlobalNotifications";
import MainLayout from "./components/dashboard/layout/MainLayout";
import Login from "./pages/Auth/Login";
// import Signup from "./pages/Auth/Signup";
import Landing from "./pages/Landing";
import UserProfile from "./pages/User/UserProfile";
// import Notifications from "./pages/Notifications";

import DepartmentGateway from "./pages/Dashboard/DepartmentGateway";
// import DepartmentDashboard from "./pages/Dashboard/DepartmentDashboard";
import AdminRoleManager from "./pages/admin-side/AdminRoleManager";
import Head from "./pages/admin-side/Head";
import HeadProjectView from "./pages/admin-side/HeadProjectView";
import HeadProjectOverview from "./pages/admin-side/HeadProjectOverview";
import HeadBillings from "./pages/admin-side/HeadBillings";
import CustomProjectsList from "./pages/admin-side/CustomProjectsList";
import CustomProjectDetail from "./pages/admin-side/CustomProjectDetail";

import EmployeeLayout from "./components/dashboard/layout/EmployeeLayout";
import EmployeeCockpit from "./pages/Employee/EmployeeCockpit";
import AssignedProjectsList from "./pages/Employee/AssignedProjectsList";
import ProjectDetailView from "./pages/Employee/ProjectDetailView";
import Projects from "./pages/Projects";
import HRDashboard from "./pages/admin-side/HRDashboard";
import HRProjectProgress from "./pages/admin-side/HRProjectProgress";
import Admin from "./pages/admin-side/Admin";

// Placeholder for other role pages (to be created)
const SuperAdminPage = () => (
  <div style={{ color: "#fff", padding: 20 }}>
    <h1>Super Admin Dashboard</h1>
    <p>This page is under construction.</p>
  </div>
);

const AdminDashboardPage = () => (
  <div style={{ color: "#fff", padding: 20 }}>
    <h1>Admin Dashboard</h1>
    <p>This page is under construction.</p>
  </div>
);

const DeveloperPage = () => (
  <div style={{ color: "#fff", padding: 20 }}>
    <h1>Developer Dashboard</h1>
    <p>This page is under construction.</p>
  </div>
);
//     above placeolders for particular roles not importand
function App() {
  return (
    <ToastProvider>
      <ThemeProvider theme={theme}>
        <GlobalNotifications />
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/signup" element={<Signup />} /> */}
            <Route path="/app" element={<MainLayout />}>
              <Route index element={<Navigate to="/app/gateway" replace />} />
              <Route path="gateway" element={<DepartmentGateway />} />
              {/* <Route
                path="department/:deptId"
                element={<DepartmentDashboard />}
              /> */}
              <Route path="profile" element={<UserProfile />} />
              <Route path="projects" element={<Projects />} />
              {/* <Route path="notifications" element={<Notifications />} /> */}
            </Route>

            {/* Employee Portal Routes */}
            <Route path="/employee" element={<EmployeeLayout />}>
              <Route
                index
                element={<Navigate to="/employee/cockpit" replace />}
              />
              <Route path="cockpit" element={<EmployeeCockpit />} />
              <Route path="cockpit/:deptId" element={<EmployeeCockpit />} />
            </Route>

            {/* App Routes (Employee-accessible) */}
            <Route path="/app" element={<EmployeeLayout />}>
              <Route path="projects" element={<AssignedProjectsList />} />
              <Route
                path="projects/:projectId"
                element={<ProjectDetailView />}
              />
            </Route>

            <Route path="/admin" element={<AdminRoleManager />} />
            <Route path="/head" element={<Head />} />
            <Route path="/head/projects" element={<HeadProjectView />} />
            <Route
              path="/head/project-overview"
              element={<HeadProjectOverview />}
            />
            <Route path="/head/billings" element={<HeadBillings />} />
            <Route path="/head/custom-projects" element={<CustomProjectsList />} />
            <Route path="/head/custom-projects/:id" element={<CustomProjectDetail />} />

            <Route path="/hr-dashboard" element={<HRDashboard />} />
            <Route
              path="/hr/project-progress"
              element={<HRProjectProgress />}
            />
            <Route path="/super-admin" element={<SuperAdminPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            <Route path="/developer" element={<DeveloperPage />} />
            <Route path="/ceo" element={<Admin />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
