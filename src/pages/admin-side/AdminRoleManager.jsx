const API_URL = import.meta.env.VITE_API_URL;
import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
  IconButton,
  Fade,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Provide a linear gradient for the icons
const GradientDefs = () => (
  <svg width="0" height="0">
    <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#1e5296" />
      <stop offset="100%" stopColor="#0b2545" />
    </linearGradient>
  </svg>
);

const roles = [
  {
    title: "HR",
    icon: (
      <PersonIcon
        sx={{
          fontSize: 100,
          fill: "url(#blue-gradient)",
          filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.15))",
        }}
      />
    ),
    description: "Personal management\nand Operational routing",
    route: "/hr-dashboard",
  },
  {
    title: "Head",
    icon: (
      <GroupsIcon
        sx={{
          fontSize: 100,
          fill: "url(#blue-gradient)",
          filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.15))",
        }}
      />
    ),
    description: "Departmental leadership\nand Protocol verification",
    route: "/head",
  },
  {
    title: "CEO",
    icon: (
      <AdminPanelSettingsIcon
        sx={{
          fontSize: 100,
          fill: "url(#blue-gradient)",
          filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.15))",
        }}
      />
    ),
    description: "Executive oversight\nand Company management",
    route: "/ceo",
  },
];

const AdminRoleManager = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    position: "",
  });

  const handleOpen = (role) => {
    setSelectedRole(role);
    setFormData({
      email: "",
      password: "",
      position: role.title,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRole(null);
    setShowPassword(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/admin/verify_authorization`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      if (res.data && res.data.position) {
        const position = res.data.position.toLowerCase().trim();
        let token = res.data.token;
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminRole", position);

        const matchedRole = roles.find(
          (role) => role.title.toLowerCase() === position
        );

        if (matchedRole) {
          handleClose();
          navigate(matchedRole.route);
        } else {
          alert("Invalid role position");
        }
      } else {
        alert("Response doesn't contain position information");
      }
    } catch (error) {
      alert("Failed to verify authorization. Please check your credentials.");
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#ffffff", // Clean white background
        position: "relative",
        overflowY: "auto",
      }}
    >
      <GradientDefs />

      <Fade in={true} timeout={800}>
        <Box sx={{ width: "100%", maxWidth: 950, textAlign: "center" }}>
          {/* Header Section */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: "#4B5563",
                mb: 1.5,
                fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.5rem" },
                letterSpacing: "-0.02em",
              }}
            >
              Access Portal
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#6B7280",
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
                fontWeight: 500,
              }}
            >
              Access your company workspace based on your assigned role
            </Typography>
          </Box>

          {/* Cards Grid */}
          <Grid container spacing={5} justifyContent="center">
            {roles.map((role, index) => (
              <Grid item xs={12} sm={6} md={6} key={role.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  style={{ height: "100%" }}
                >
                  <Card
                    onClick={() => handleOpen(role)}
                    elevation={0}
                    sx={{
                      cursor: "pointer",
                      height: "100%",
                      py: 6,
                      px: 4,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      borderRadius: "16px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #f0f0f0",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
                        borderColor: "#e0e0e0",
                        "& .circle-icon": {
                          transform: "scale(1.05)",
                        },
                      },
                    }}
                  >
                    {/* Circle Background for Icon */}
                    <Box
                      className="circle-icon"
                      sx={{
                        width: 140,
                        height: 140,
                        borderRadius: "50%",
                        backgroundColor: "#E8F0FE", // Light blue matching the design
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 4,
                        transition: "transform 0.3s ease",
                      }}
                    >
                      {role.icon}
                    </Box>

                    {/* Role Title */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#4B5563",
                        mb: 1.5,
                        fontSize: "1.5rem",
                      }}
                    >
                      {role.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280",
                        fontWeight: 500,
                        whiteSpace: "pre-line",
                        lineHeight: 1.5,
                      }}
                    >
                      {role.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Fade>

      {/* Clean Desktop/Mobile Login Dialog */}
      <AnimatePresence>
        {open && (
          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                width: { xs: "90vw", sm: "360px" },
                maxWidth: "360px",
                borderRadius: "16px",
                p: { xs: 2, sm: 3 },
                boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                backgroundColor: "#ffffff",
                mx: "auto",
              },
            }}
          >
            <DialogTitle sx={{ textAlign: "center", pt: 2, pb: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#374151",
                  mb: 0.5,
                }}
              >
                {selectedRole?.title} Authorization
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#6B7280" }}
              >
                Enter your security credentials
              </Typography>
            </DialogTitle>

            <DialogContent>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email Address"
                  placeholder="admin@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    "& .MuiInputBase-input": { color: "#000000" },
                    "& .MuiInputLabel-root": { color: "#4B5563" },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          tabIndex={-1}
                          sx={{ color: "#4B5563" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-input": { color: "#000000" },
                    "& .MuiInputLabel-root": { color: "#4B5563" },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      "& input": {
                        "&::-ms-reveal": { display: "none" },
                        "&::-ms-clear": { display: "none" },
                      },
                    },
                  }}
                />

                <Button
                  onClick={handleSubmit}
                  fullWidth
                  variant="contained"
                  disableElevation
                  sx={{
                    mt: 1,
                    py: 1.5,
                    borderRadius: "12px",
                    backgroundColor: "#1A5296",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: "1rem",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#0D2B51",
                    },
                  }}
                >
                  Verify Authorization
                </Button>
              </Stack>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default AdminRoleManager;
