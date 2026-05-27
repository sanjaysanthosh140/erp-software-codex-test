/**
 * AntyGravity Instruction:
 * Apply rules from /docs/component_analysis_prompt.md
 */import React from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();
  const isGateway = location.pathname === "/app/gateway";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#0a0e17" }}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: isGateway ? 0 : 3,
            overflow: "auto",
            background:
              "radial-gradient(circle at 10% 20%, rgba(0, 212, 255, 0.03) 0%, transparent 40%)",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
