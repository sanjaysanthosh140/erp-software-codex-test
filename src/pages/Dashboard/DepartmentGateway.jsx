import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useToast } from "../../context/ToastContext";

/* ─── Department accent colors (Dark Navy/Blue Variants from Figma) ─── */
const BLUE_VARIANTS = [
  "linear-gradient(135deg, #1A4276 0%, #0B2545 100%)",
  "linear-gradient(135deg, #1E5296 0%, #0D2B51 100%)",
  "linear-gradient(135deg, #154581 0%, #091F3A 100%)",
  "linear-gradient(135deg, #113562 0%, #07152B 100%)",
];

/* ─── Skeleton while loading ─── */
const SkeletonCard = () => (
  <Box
    sx={{
      height: 170,
      width: "100%",
      borderRadius: "12px",
      background: "#f3f4f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 3,
    }}
  >
    <Skeleton variant="text" width="70%" height={40} />
  </Box>
);

/* ─── Simplified Modern Card (Figma Match) ─── */
const DeptCard = ({ dept, onClick, index }) => {
  const gradient = BLUE_VARIANTS[index % BLUE_VARIANTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Box
        onClick={onClick}
        sx={{
          height: 170,
          width: "100%",
          borderRadius: "12px",
          cursor: "pointer",
          background: gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 3,
          py: 2,
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 30px rgba(26, 82, 150, 0.3)",
          },
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            color: "#ffffff",
            fontSize: { xs: "1.2rem", sm: "1.25rem", md: "1.35rem", lg: "1.45rem" },
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            width: "100%",
            px: 1,
            overflowWrap: "break-word",
            wordBreak: "normal",
            whiteSpace: "normal",
            userSelect: "none",
          }}
        >
          {dept.title}
        </Typography>
      </Box>
    </motion.div>
  );
};

/* ─── Main Page ─── */
const DepartmentGateway = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://project-management-sodtware-backend-end.onrender.com/admin/departments")
      .then((res) => {
        setDepartments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch departments:", err);
        setLoading(false);
      });
  }, []);

  const handleEnter = async (deptId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Authentication required. Please log in.", "warning");
        navigate("/login");
        return;
      }

      const res = await axios.get("https://project-management-sodtware-backend-end.onrender.com/employee_profile", {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });
      const employeeData = res.data;
      const employeeDept = employeeData[0].department;
      const employeeName = employeeData[0].name;

      const deptDisplay =
        departments.find((d) => d.Dep_id === deptId)?.title ||
        deptId.toUpperCase();
      const userDeptDisplay =
        departments.find((d) => d.Dep_id === employeeDept)?.title ||
        employeeDept.toUpperCase();

      if (employeeDept === deptId) {
        showToast(
          `Welcome back, ${employeeName}! Entering ${deptDisplay}.`,
          "success"
        );
        navigate(`/employee/cockpit/${deptId}`);
      } else {
        showToast(
          `Hi ${employeeName}, you currently only have access to the ${userDeptDisplay} department.`,
          "warning"
        );
      }
    } catch (error) {
      console.error("Authorization check failed:", error);
      showToast(
        "Failed to verify authorization. Please login again.",
        "error"
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#ffffff",
        py: { xs: 8, md: 10 },
        px: { xs: 2.5, sm: 4 },
        overflowY: "auto",
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 8,
            textAlign: "center",
          }}
        >
          {/* Pill Badge */}
          <Box
            sx={{
              px: 3,
              py: 0.8,
              borderRadius: "30px",
              border: "1px solid rgba(0, 0, 0, 0.12)",
              mb: 3,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: "#6B7280",
                letterSpacing: "0.02em",
                fontSize: "0.85rem",
              }}
            >
              Department Portal
            </Typography>
          </Box>

          {/* Title and Subtitle */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "#374151",
              mb: 2,
              fontSize: { xs: "2.4rem", md: "3rem" },
              letterSpacing: "-0.02em",
            }}
          >
            Choose your Division
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#6B7280",
              maxWidth: 520,
              mx: "auto",
              lineHeight: 1.6,
              fontSize: "1.05rem",
            }}
          >
            Select your department to access your workspace, track tasks, and
            collaborate with your team.
          </Typography>
        </Box>

        {/* Grid Container */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
            width: "100%",
          }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
              <Box key={`skel-${i}`} sx={{ width: "100%" }}>
                <SkeletonCard />
              </Box>
            ))
            : departments.map((dept, i) => (
              <Box key={dept.id || i} sx={{ display: "flex", width: "100%" }}>
                <DeptCard
                  dept={dept}
                  onClick={() => handleEnter(dept.Dep_id)}
                  index={i}
                />
              </Box>
            ))}
        </Box>

        {!loading && departments.length === 0 && (
          <Box sx={{ mt: 10, textAlign: "center" }}>
            <Typography sx={{ color: "#9CA3AF", fontSize: "1.1rem" }}>
              No departments available.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default DepartmentGateway;
