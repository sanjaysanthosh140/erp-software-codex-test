const API_URL = import.meta.env.VITE_API_URL;
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  alpha,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Stack,
  Alert,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import axios from "axios";
import { useToast } from "../../context/ToastContext";
import { motion } from "framer-motion";
import { Bolt as BoltIcon, Visibility, VisibilityOff } from "@mui/icons-material";

/* ─── All original API logic untouched below ─── */
const Login = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setformData] = useState({ email: "", password: "" });
  const [alertStatus, setAlertStatus] = useState(null); // "error" or "success"
  const [alertMessage, setAlertMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChnage = (e) => {
    try {
      const { name, value } = e.target;
      setformData((preve) => ({ ...preve, [name]: value }));
    } catch (error) {
      console.log(error);
    }
  };

  const handle_submit = async () => {
    try {
      if (formData.email && formData.password) {
        const res = await axios.post(`${API_URL}/login`, formData, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.status === 200) {
          setAlertStatus("success");
          setAlertMessage("Login successful! Redirecting...");
          showToast("Login successful!", "success");
          console.log(res.data);
          localStorage.setItem("token", res.data.token);
          sessionStorage.setItem("justLoggedIn", "true");
          setTimeout(() => { navigate("/app/gateway"); }, 1000);
        }
      } else {
        setAlertStatus("error");
        setAlertMessage("Please fill in all fields");
        showToast("Please fill in all fields", "warning");
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        // Invalid email or password
        setAlertStatus("error");
        setAlertMessage(error.response?.data?.message || "Invalid email or password. Please try again.");
      } else if (error.response?.status >= 500) {
        // Server error
        setAlertStatus("error");
        setAlertMessage("Server error. Please try again later.");
      } else {
        setAlertStatus("error");
        setAlertMessage(error.response?.data?.message || "Login failed. Please check your credentials.");
      }
      showToast("Login failed", "error");
    }
  };

  /* ── Shared glass input style ── */
  const inputSx = {
    mb: 2.5,
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      background: "#fff",
      "& fieldset": {
        borderColor: "rgba(0, 0, 0, 0.08)",
        borderWidth: "1.5px",
      },
      "&:hover fieldset": {
        borderColor: "rgba(0, 0, 0, 0.15)",
      },
      "&.Mui-focused": {
        "& fieldset": {
          borderColor: "#1A5296",
          borderWidth: "1.5px",
        },
      },
    },
    "& input": {
      color: "#333",
      fontSize: "0.95rem",
      py: 1.8,
      "&::placeholder": { color: "#b0b0b0", opacity: 1 },
      "&::-ms-reveal": { display: "none" },
      "&::-ms-clear": { display: "none" },
      "&::-webkit-credentials-auto-fill-button": { display: "none" },
    },
    "& .MuiInputAdornment-root svg": {
      color: "#9e9e9e",
      fontSize: "22px",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#ffffff",
        p: { xs: 2.5, sm: 4 },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: 500 }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 6 }}>
          {/* Pill Badge */}
          <Box
            sx={{
              px: 3,
              py: 1,
              borderRadius: "30px",
              border: "1px solid rgba(0, 0, 0, 0.12)",
              mb: 3,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "#4B5563", letterSpacing: "0.02em" }}
            >
              Department Portal
            </Typography>
          </Box>

          {/* Title and Subtitle */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#374151",
              textAlign: "center",
              mb: 2.5,
              fontSize: { xs: "2rem", md: "3rem" },
              letterSpacing: "-0.01em",
            }}
          >
            Choose your Division
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#6B7280",
              textAlign: "center",
              maxWidth: 440,
              lineHeight: 1.6,
              mb: 0,
              fontSize: "1.05rem",
            }}
          >
            Select your department to access your workspace, track tasks, and collaborate with your team.
          </Typography>
        </Box>

        <Box sx={{ width: "100%", px: { xs: 1, sm: 4 } }}>
          {/* Alert Messages */}
          {alertStatus === "error" && (
            <Alert
              severity="error"
              onClose={() => setAlertStatus(null)}
              sx={{ mb: 3, borderRadius: "12px" }}
            >
              {alertMessage}
            </Alert>
          )}
          {alertStatus === "success" && (
            <Alert
              severity="success"
              onClose={() => setAlertStatus(null)}
              sx={{ mb: 3, borderRadius: "12px" }}
            >
              {alertMessage}
            </Alert>
          )}

          {/* Email Input */}
          <TextField
            fullWidth
            required
            variant="outlined"
            placeholder="Enter Your Email"
            name="email"
            value={formData.email}
            onChange={handleChnage}
            sx={inputSx}
          />

          {/* Password Input */}
          <TextField
            fullWidth
            required
            variant="outlined"
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            name="password"
            value={formData.password}
            onChange={handleChnage}
            sx={inputSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Extra Buttons Row */}
          {/* <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 4, mt: -0.5 }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  sx={{
                    color: "rgba(0, 0, 0, 0.12)",
                    "&.Mui-checked": { color: "#1A5296" },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 500 }}>
                  Remember Me
                </Typography>
              }
            />
            <Typography
              variant="body2"
              sx={{
                color: "#1A5296",
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Forgot Password
            </Typography>
          </Stack> */}

          {/* Login Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handle_submit}
            sx={{
              py: 2,
              borderRadius: "12px",
              background: "#1A5296",
              fontSize: "1.1rem",
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 10px 25px rgba(26, 82, 150, 0.2)",
              "&:hover": {
                background: "#14437a",
                boxShadow: "0 12px 30px rgba(26, 82, 150, 0.3)",
              },
            }}
          >
            Login
          </Button>

          {/* Footer Link */}
          {/* <Box sx={{ mt: 5, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 500 }}>
              Don't have an account?{" "}
              <span
                style={{
                  color: "#1A5296",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              // onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </Typography>
          </Box> */}
        </Box>
      </motion.div>
    </Box>
  );
};

export default Login;
