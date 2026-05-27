import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert, alpha, styled } from "@mui/material";

const GlassAlert = styled(Alert)(({ theme, severity }) => ({
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(24px) saturate(180%)",
  borderRadius: "16px",
  border: "1px solid rgba(10, 15, 25, 0.08)",
  boxShadow: "0 8px 32px rgba(10, 15, 25, 0.08)",
  color: "#0f172a",
  fontWeight: 600,
  padding: "12px 20px",
  "& .MuiAlert-icon": {
    color: severity === "info" ? "#4f46e5" : severity === "success" ? "#10b981" : severity === "error" ? "#ef4444" : "#f59e0b",
  },
}));

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const showToast = useCallback((msg, sev = "success") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <GlassAlert
          onClose={handleClose}
          severity={severity}
          variant="outlined"
          sx={{
            width: "100%",
            "& .MuiAlert-message": {
              letterSpacing: "0.01em"
            }
          }}
        >
          {message}
        </GlassAlert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
