import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  alpha,
  Fade,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const DepartmentManager = ({
  departments,
  onAddDepartment,
  onEditDepartment,
  onDeleteDepartment,
}) => {
  return (
    <Fade in={true}>
      <Box sx={{ width: "100%" }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
            Departments
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddDepartment}
            sx={{
              background: "#0f4c81",
              color: "#fff",
              borderRadius: "8px",
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": { background: "#0c3d68" }
            }}
          >
            Add Department
          </Button>
        </Box>

        {/* Grid Section */}
        <Grid container spacing={3}>
          {departments.map((dept) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={dept.id || dept._id}>
              <Box
                sx={{
                  background: "#fff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  border: "1px solid #f1f5f9",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  }
                }}
              >
                {/* Top Border Indicator */}
                <Box
                  sx={{
                    height: "4px",
                    width: "100%",
                    background: dept.color || "#38bdf8",
                  }}
                />

                <Box sx={{ p: 3, flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "#1e293b", mb: 0.5, fontSize: "1.05rem" }}
                  >
                    {dept.title || "Untitled"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", fontWeight: 500, lineHeight: 1.6, fontSize: "0.85rem" }}
                  >
                    {dept.description || "even stone to become precious"}
                  </Typography>
                </Box>

                {/* Card Actions - Aligned to Right */}
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1.5,
                  }}
                >
                  <Button
                    size="small"
                    onClick={() => onEditDepartment(dept)}
                    sx={{
                      minWidth: "70px",
                      background: "#fff",
                      color: "#1e40af",
                      border: "1px solid #e5e7eb",
                      fontWeight: 700,
                      borderRadius: "6px",
                      textTransform: "none",
                      fontSize: "0.8rem",
                      boxShadow: "none",
                      "&:hover": {
                        background: "#f8fafc",
                        borderColor: "#d1d5db",
                        boxShadow: "none"
                      }
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    onClick={() => onDeleteDepartment(dept._id)}
                    sx={{
                      minWidth: "70px",
                      background: "#fff",
                      color: "#ef4444",
                      border: "1px solid #e5e7eb",
                      fontWeight: 700,
                      borderRadius: "6px",
                      textTransform: "none",
                      fontSize: "0.8rem",
                      boxShadow: "none",
                      "&:hover": {
                        background: "#fef2f2",
                        borderColor: "#fca5a5",
                        boxShadow: "none"
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Fade>
  );
};

export default DepartmentManager;
