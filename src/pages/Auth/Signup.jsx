/**
 * AntyGravity Instruction:
 * Apply rules from /docs/component_analysis_prompt.md
 */
import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  alpha,
  InputAdornment,
} from "@mui/material";
import { GlassContainer } from "../../components/common/GlassComp";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";
import { MenuItem } from "@mui/material";

const departments = ["IT", "Digital Marketing"];

const PRIMARY_SLATE = "#0f172a";
const SECONDARY_SLATE = "#475569";
const INDIGO_ACCENT = "#4f46e5";
const GLASS_BG = "rgba(255, 255, 255, 0.75)";
const GLASS_BORDER = "rgba(10, 15, 25, 0.08)";

const Signup = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const formdatas = new FormData();
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const handlechange = (e) => {
    try {
      const { name, value } = e.target;
      setformdata((prev) => ({
        ...prev,
        [name]: value,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const formsubmition = async () => {
    try {
      console.log(formdata);
      if (
        formdata.email &&
        formdata.name &&
        formdata.password &&
        formdata.department
      ) {
        const res = await axios.post("https://project-management-sodtware-backend-end.onrender.com/signup", formdata, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 200) {
          console.log(res.data);
          showToast("Account created successfully!", "success");
          // navigate to dashboard or login
          setTimeout(() => {
            navigate("/app/gateway");
          }, 1000);
        }
      } else {
        showToast("Please fill in all fields", "warning");
      }
    } catch (error) {
      console.log(error);
      showToast("Signup failed", "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f8fafc",
        position: "relative",
        overflow: "hidden",
        p: 2,
      }}
    >
      {/* Background Mesh Gradients */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            left: "10%",
            width: "60vw",
            height: "60vw",
            background: "radial-gradient(circle, rgba(79, 70, 229, 0.05) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(80px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "0%",
            right: "5%",
            width: "50vw",
            height: "50vw",
            background: "radial-gradient(circle, rgba(15, 23, 42, 0.03) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(100px)",
          }}
        />
      </Box>

      <GlassContainer
        sx={{
          maxWidth: 450,
          width: "100%",
          p: { xs: 4, md: 6 },
          textAlign: "center",
          background: GLASS_BG,
          border: `1px solid ${GLASS_BORDER}`,
          backdropFilter: "blur(48px) saturate(180%)",
          boxShadow: "0 32px 64px -12px rgba(10, 15, 25, 0.08)",
          borderRadius: "32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, color: PRIMARY_SLATE, mb: 1.5, letterSpacing: "-0.02em" }}
          >
            Create Account
          </Typography>
          <Typography variant="body2" sx={{ color: SECONDARY_SLATE, fontWeight: 500, lineHeight: 1.6 }}>
            Join the consortium and start orchestrating your projects with absolute precision.
          </Typography>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          type="text"
          placeholder="Full Name"
          name="name"
          value={formdata.name}
          onChange={handlechange}
          sx={{
            mb: 2.5,
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.6)",
              borderRadius: "16px",
              transition: "all 0.3s ease",
              "& fieldset": { borderColor: GLASS_BORDER },
              "&:hover fieldset": { borderColor: alpha(PRIMARY_SLATE, 0.15) },
              "&.Mui-focused fieldset": { borderColor: INDIGO_ACCENT, borderWidth: "2px" },
            },
            "& input": {
              color: PRIMARY_SLATE,
              fontWeight: 600,
              fontSize: "0.95rem",
              "&::placeholder": { color: alpha(SECONDARY_SLATE, 0.5), opacity: 1 }
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon sx={{ color: alpha(SECONDARY_SLATE, 0.4), fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          variant="outlined"
          type="email"
          placeholder="Email Address"
          name="email"
          value={formdata.email}
          onChange={handlechange}
          sx={{
            mb: 2.5,
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.6)",
              borderRadius: "16px",
              transition: "all 0.3s ease",
              "& fieldset": { borderColor: GLASS_BORDER },
              "&:hover fieldset": { borderColor: alpha(PRIMARY_SLATE, 0.15) },
              "&.Mui-focused fieldset": { borderColor: INDIGO_ACCENT, borderWidth: "2px" },
            },
            "& input": {
              color: PRIMARY_SLATE,
              fontWeight: 600,
              fontSize: "0.95rem",
              "&::placeholder": { color: alpha(SECONDARY_SLATE, 0.5), opacity: 1 }
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: alpha(SECONDARY_SLATE, 0.4), fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          fullWidth
          variant="outlined"
          displayEmpty
          name="department"
          value={formdata.department}
          onChange={handlechange}
          sx={{
            mb: 2.5,
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.6)",
              borderRadius: "16px",
              transition: "all 0.3s ease",
              "& fieldset": { borderColor: GLASS_BORDER },
              "&:hover fieldset": { borderColor: alpha(PRIMARY_SLATE, 0.15) },
              "&.Mui-focused fieldset": { borderColor: INDIGO_ACCENT, borderWidth: "2px" },
            },
            "& .MuiSelect-select": {
              color: formdata.department ? PRIMARY_SLATE : alpha(SECONDARY_SLATE, 0.5),
              fontWeight: 600,
              textAlign: "left",
              fontSize: "0.95rem",
            },
            "& .MuiSvgIcon-root": { color: alpha(SECONDARY_SLATE, 0.4) },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <WorkIcon sx={{ color: alpha(SECONDARY_SLATE, 0.4), fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="" disabled>
            Select Department
          </MenuItem>
          {departments.map((dept) => (
            <MenuItem key={dept} value={dept}>
              {dept}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          variant="outlined"
          type="password"
          placeholder="Password"
          name="password"
          value={formdata.password}
          onChange={handlechange}
          sx={{
            mb: 4,
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.6)",
              borderRadius: "16px",
              transition: "all 0.3s ease",
              "& fieldset": { borderColor: GLASS_BORDER },
              "&:hover fieldset": { borderColor: alpha(PRIMARY_SLATE, 0.15) },
              "&.Mui-focused fieldset": { borderColor: INDIGO_ACCENT, borderWidth: "2px" },
            },
            "& input": {
              color: PRIMARY_SLATE,
              fontWeight: 600,
              fontSize: "0.95rem",
              "&::placeholder": { color: alpha(SECONDARY_SLATE, 0.5), opacity: 1 }
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: alpha(SECONDARY_SLATE, 0.4), fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          type="submit"
          onClick={formsubmition}
          sx={{
            py: 2,
            fontSize: "1rem",
            fontWeight: 900,
            borderRadius: "16px",
            textTransform: "none",
            background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.15)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
              transform: "translateY(-1px)",
              boxShadow: "0 12px 28px rgba(15, 23, 42, 0.25)",
            },
          }}
        >
          Initialize Protocol
        </Button>

        <Box sx={{ mt: 4, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <Box
              sx={{ height: "1px", bgcolor: GLASS_BORDER, flex: 1 }}
            />
            <Typography variant="caption" sx={{ color: alpha(SECONDARY_SLATE, 0.5), fontWeight: 700, letterSpacing: 1 }}>
              OR CONTINUE WITH
            </Typography>
            <Box
              sx={{ height: "1px", bgcolor: GLASS_BORDER, flex: 1 }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={async () => {
                try {
                  window.location.href = "https://project-management-sodtware-backend-end.onrender.com/google/auth";
                } catch (error) {
                  console.log(error);
                  showToast("Google Signup Failed", "error");
                }
              }}
              sx={{
                color: PRIMARY_SLATE,
                fontWeight: 800,
                borderRadius: "14px",
                textTransform: "none",
                borderColor: GLASS_BORDER,
                background: "rgba(255,255,255,0.4)",
                "&:hover": {
                  borderColor: alpha(PRIMARY_SLATE, 0.2),
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Google
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GitHubIcon />}
              onClick={async () => {
                try {
                  window.location.href = "https://project-management-sodtware-backend-end.onrender.com/oauth2/github";
                } catch (error) {
                  console.log(error);
                  showToast("GitHub Signup Failed", "error");
                }
              }}
              sx={{
                color: PRIMARY_SLATE,
                fontWeight: 800,
                borderRadius: "14px",
                textTransform: "none",
                borderColor: GLASS_BORDER,
                background: "rgba(255,255,255,0.4)",
                "&:hover": {
                  borderColor: alpha(PRIMARY_SLATE, 0.2),
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              GitHub
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ color: SECONDARY_SLATE, fontWeight: 500 }}>
            Already have an account?{" "}
            <span
              style={{ color: INDIGO_ACCENT, fontWeight: 800, cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>
          </Typography>
        </Box>
      </GlassContainer>
    </Box>
  );
};

export default Signup;
