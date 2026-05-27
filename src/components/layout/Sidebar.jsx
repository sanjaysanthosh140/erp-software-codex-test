/**
 * Sidebar.jsx – fully responsive.
 * Desktop (md+): permanent sidebar, 260px wide with labels.
 * Tablet (sm):   permanent sidebar, 72px icon-only.
 * Mobile (xs):   temporary drawer, slides in from left on hamburger press.
 */
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  IconButton,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/app/gateway" },
  { text: "Settings", icon: <SettingsIcon />, path: "/app/settings" },
];

const PRIMARY_SLATE = "#0f172a";
const SECONDARY_SLATE = "#475569";
const INDIGO_ACCENT = "#4f46e5";
const GLASS_BG = "rgba(255, 255, 255, 0.25)";
const GLASS_BORDER = "rgba(255, 255, 255, 0.4)";

const DRAWER_WIDTH = 260;
const MINI_WIDTH = 72;

const Sidebar = ({ mobileOpen, onClose, isMobile, drawerWidth = DRAWER_WIDTH }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.between("sm", "md")); // 481–768

  // Icon-only when small tablet (not mobile, not full desktop)
  const collapsed = isSmall && !isMobile;
  const currentWidth = isMobile ? drawerWidth : collapsed ? MINI_WIDTH : drawerWidth;

  const drawerContent = (
    <Box
      sx={{
        width: currentWidth,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: GLASS_BG,
        backdropFilter: "blur(48px) saturate(180%)",
        borderRight: `1px solid ${GLASS_BORDER}`,
        boxShadow: "10px 0 40px rgba(10, 15, 25, 0.04)",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflowX: "hidden",
      }}
    >
      {/* Brand / logo area */}
      <Box sx={{ p: collapsed ? 1 : 3, minHeight: 64, display: "flex", alignItems: "center" }} />

      {/* Nav items */}
      <List sx={{ px: collapsed ? 0.5 : 1.5, mt: 1, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.text}
              onClick={() => {
                navigate(item.path);
                if (isMobile) onClose();
              }}
              sx={{
                mb: 0.5,
                gap: 1.5,
                borderRadius: "12px",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.3s ease",
                px: collapsed ? 1 : 2,
                py: 1.5,
                justifyContent: collapsed ? "center" : "flex-start",
                background: isActive
                  ? `linear-gradient(90deg, ${alpha(INDIGO_ACCENT, 0.08)} 0%, transparent 100%)`
                  : "transparent",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "4px",
                  height: isActive ? "24px" : "0px",
                  backgroundColor: INDIGO_ACCENT,
                  borderRadius: "0 4px 4px 0",
                  transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isActive ? `0 0 12px ${alpha(INDIGO_ACCENT, 0.4)}` : "none",
                },
                "&:hover": {
                  background: alpha(INDIGO_ACCENT, 0.04),
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? INDIGO_ACCENT : alpha(SECONDARY_SLATE, 0.6),
                  minWidth: 0,
                  mr: collapsed ? 0 : 1.5,
                  display: "flex",
                  justifyContent: "center",
                  transition: "color 0.3s ease",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 800 : 500,
                    color: isActive ? PRIMARY_SLATE : alpha(SECONDARY_SLATE, 0.7),
                    letterSpacing: "0.01em",
                    noWrap: true,
                  }}
                  sx={{ m: 0 }}
                />
              )}
            </ListItem>
          );
        })}
      </List>

      {/* User card – hide in collapsed mode */}
      {!collapsed && (
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: "20px",
              background: "rgba(255,255,255,0.25)",
              border: `1px solid ${GLASS_BORDER}`,
              boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
              backdropFilter: "blur(24px)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <Avatar
                src="/broken-image.jpg"
                sx={{
                  width: 36,
                  height: 36,
                  border: `2px solid ${alpha(INDIGO_ACCENT, 0.2)}`,
                  bgcolor: alpha(INDIGO_ACCENT, 0.1),
                  flexShrink: 0,
                }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  noWrap
                  sx={{ color: PRIMARY_SLATE, fontWeight: 800, lineHeight: 1.2 }}
                >
                  Alkor User
                </Typography>
                <Typography variant="caption" noWrap sx={{ color: SECONDARY_SLATE, fontWeight: 500 }}>
                  Product Owner
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              sx={{
                width: "100%",
                borderRadius: "10px",
                py: 0.8,
                color: alpha(SECONDARY_SLATE, 0.6),
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "none",
                border: `1px solid ${alpha(SECONDARY_SLATE, 0.1)}`,
                "&:hover": {
                  color: "#ef4444",
                  background: alpha("#ef4444", 0.08),
                  borderColor: alpha("#ef4444", 0.2),
                },
              }}
            >
              <LogoutIcon sx={{ fontSize: 16, mr: 1 }} /> Logout
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* Mobile: temporary drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              border: "none",
              background: "transparent",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop/Tablet: permanent drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            width: currentWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: currentWidth,
              boxSizing: "border-box",
              border: "none",
              background: "transparent",
              transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
              overflowX: "hidden",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
