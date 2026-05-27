/**
 * AntyGravity Instruction:
 * Apply rules from /docs/component_analysis_prompt.md
 */import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Alert,
  alpha,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const PRIMARY_SLATE = "#0f172a";
const SECONDARY_SLATE = "#475569";
const INDIGO_ACCENT = "#4f46e5";
const GLASS_BG = "rgba(255, 255, 255, 0.75)";
const GLASS_BORDER = "rgba(10, 15, 25, 0.08)";

const DeadlineNotifications = ({ userId }) => {
  const [deadlines, setDeadlines] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        // TODO: Replace with actual API call
        // const res = await axios.get(`/api/projects/deadlines?userId=${userId}`);
        // setDeadlines(res.data);

        // Mock data for now
        const mockDeadlines = [
          {
            projectId: "p1",
            title: "AI Analytics Engine",
            deadline: "2026-02-05",
            daysRemaining: 5,
          },
          {
            projectId: "p2",
            title: "Cloud Migration Phase 2",
            deadline: "2026-02-15",
            daysRemaining: 15,
          },
          {
            projectId: "p3",
            title: "Mobile App Redesign",
            deadline: "2026-02-02",
            daysRemaining: 2,
          },
        ];

        setTimeout(() => {
          setDeadlines(mockDeadlines);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching deadlines:", error);
        setLoading(false);
      }
    };

    fetchDeadlines();
  }, [userId]);

  const getUrgencyLevel = (days) => {
    if (days <= 2)
      return { level: "critical", color: "#ff5b5b", icon: ErrorOutlineIcon };
    if (days <= 7)
      return { level: "warning", color: "#ffab00", icon: WarningAmberIcon };
    return { level: "normal", color: "#00e676", icon: CheckCircleOutlineIcon };
  };

  const urgentDeadlines = deadlines.filter((d) => d.daysRemaining <= 7);

  if (loading || urgentDeadlines.length === 0) return null;

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        mb: 4,
        background: GLASS_BG,
        backdropFilter: "blur(48px) saturate(180%)",
        borderRadius: "24px",
        border: `1px solid ${GLASS_BORDER}`,
        boxShadow: "0 12px 32px -4px rgba(10, 15, 25, 0.04)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Animated glow effect */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${alpha(INDIGO_ACCENT, 0.3)}, transparent)`,
          animation: "shimmer 4s infinite",
          "@keyframes shimmer": {
            "0%": { transform: "translateX(-100%)" },
            "100%": { transform: "translateX(100%)" },
          },
        }}
      />

      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "14px",
              background: `linear-gradient(135deg, ${alpha(INDIGO_ACCENT, 0.1)}, ${alpha(INDIGO_ACCENT, 0.05)})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${alpha(INDIGO_ACCENT, 0.15)}`,
            }}
          >
            <NotificationsActiveIcon sx={{ color: INDIGO_ACCENT, fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: PRIMARY_SLATE, lineHeight: 1.2, letterSpacing: "-0.01em" }}
            >
              Upcoming Deadlines
            </Typography>
            <Typography variant="caption" sx={{ color: SECONDARY_SLATE, fontWeight: 500 }}>
              {urgentDeadlines.length} protocol{urgentDeadlines.length !== 1 ? "s" : ""} requiring attention
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" sx={{ color: alpha(SECONDARY_SLATE, 0.4) }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Deadline List */}
      <Collapse in={expanded}>
        <Box sx={{ px: 2, pb: 2 }}>
          <AnimatePresence>
            {urgentDeadlines.map((deadline, index) => {
              const urgency = getUrgencyLevel(deadline.daysRemaining);
              const UrgencyIcon = urgency.icon;

              return (
                <motion.div
                  key={deadline.projectId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      mb: 1.5,
                      p: 2,
                      borderRadius: "16px",
                      background: "rgba(255, 255, 255, 0.4)",
                      border: `1px solid ${alpha(urgency.color, 0.15)}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        background: alpha(urgency.color, 0.05),
                        transform: "translateX(4px)",
                        borderColor: alpha(urgency.color, 0.3),
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "8px",
                          background: alpha(urgency.color, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <UrgencyIcon
                          sx={{ color: urgency.color, fontSize: 18 }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, color: PRIMARY_SLATE, mb: 0.2 }}
                        >
                          {deadline.title}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <AccessTimeIcon
                            sx={{ fontSize: 13, color: alpha(SECONDARY_SLATE, 0.5) }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: SECONDARY_SLATE, fontWeight: 500 }}
                          >
                            Due:{" "}
                            {new Date(deadline.deadline).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Chip
                      label={`${deadline.daysRemaining}d`}
                      size="small"
                      sx={{
                        bgcolor: alpha(urgency.color, 0.1),
                        color: urgency.color,
                        fontWeight: 800,
                        border: `1px solid ${alpha(urgency.color, 0.2)}`,
                        fontSize: "0.7rem",
                        height: "22px"
                      }}
                    />
                  </Box>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default DeadlineNotifications;
