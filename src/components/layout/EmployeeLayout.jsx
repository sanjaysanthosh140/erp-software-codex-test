/**
 * EmployeeLayout.jsx
 * Responsive layout: permanent sidebar on md+, collapsible drawer on mobile.
 */
import React, { useState } from "react";
import { Box, useTheme, useMediaQuery, CssBaseline } from "@mui/material";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

const DRAWER_WIDTH = 260;
const MINI_WIDTH = 72; // icon-only collapsed width on small tablets

const EmployeeLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // < 769px
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: "#f8fafc" }}>
      <CssBaseline />

      {/* Sidebar / Navigation */}
      <Box
        component="nav"
        sx={{
          width: 0,
          flexShrink: 0,
        }}
      >
        {/* <Sidebar
          mobileOpen={mobileOpen}
          onClose={handleDrawerToggle}
          isMobile={isMobile}
          drawerWidth={DRAWER_WIDTH}
        /> */}
      </Box>

      {/* Main Content Wrapper */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          // On desktop subtract sidebar width; on mobile use full width
          width: "100%",
          minWidth: 0, // prevent flex child from overflowing
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowX: "hidden",
        }}
      >
        {/* Top Header — pass toggle so it can render hamburger on mobile */}
        {/* <Topbar onMenuToggle={handleDrawerToggle} isMobile={isMobile} /> */}

        {/* Content Area – scrolls vertically */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: 0,       // key: lets flex child shrink so overflow kicks in
            overflowX: "hidden",
            overflowY: "auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeLayout;
