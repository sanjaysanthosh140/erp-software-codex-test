/**
 * AntyGravity Instruction:
 * Apply rules from /docs/component_analysis_prompt.md
 */
import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "none",
  color: "#a0aec0",
  [`& .${gridClasses.columnHeaders}`]: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    color: "#fff",
    fontSize: "0.85rem",
    fontWeight: 600,
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  },
  [`& .${gridClasses.cell}`]: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  [`& .${gridClasses.row}:hover`]: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  [`& .${gridClasses.footerContainer}`]: {
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
  },
}));

const TaskHistory = ({ tasks = [] }) => {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "title",
      headerName: "Task Name",
      width: 250,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "#fff", fontWeight: 500 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "project",
      headerName: "Project",
      width: 150,
    },
    {
      field: "completedDate",
      headerName: "Completion Date",
      width: 150,
      type: "date",
      valueGetter: (params) => new Date(params.value),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label="Done"
          size="small"
          sx={{
            bgcolor: "rgba(0, 230, 118, 0.15)",
            color: "#00e676",
            border: "1px solid rgba(0, 230, 118, 0.2)",
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      field: "timeSpent",
      headerName: "Hours",
      width: 100,
    },
  ];

  // Dummy data if none provided
  const rows =
    tasks.length > 0
      ? tasks
      : [
        {
          id: 1,
          title: "Database Schema Update",
          project: "E-Commerce",
          completedDate: "2024-01-15",
          status: "Done",
          timeSpent: 4,
        },
        {
          id: 2,
          title: "Login API Integration",
          project: "E-Commerce",
          completedDate: "2024-01-14",
          status: "Done",
          timeSpent: 3,
        },
        {
          id: 3,
          title: "Unit Tests for Auth",
          project: "Auth Service",
          completedDate: "2024-01-13",
          status: "Done",
          timeSpent: 2,
        },
        {
          id: 4,
          title: "Fix Header Alignment",
          project: "Landing Page",
          completedDate: "2024-01-12",
          status: "Done",
          timeSpent: 1,
        },
        {
          id: 5,
          title: "Deploy to Staging",
          project: "DevOps",
          completedDate: "2024-01-11",
          status: "Done",
          timeSpent: 5,
        },
      ];

  return (
    <Paper
      sx={{
        height: 400,
        width: "100%",
        background: "rgba(20, 25, 40, 0.6)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
        p: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, color: "#fff", pl: 1 }}
      >
        Previous Done Tasks
      </Typography>
      <StyledDataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        sx={{
          "& .MuiCheckbox-root": {
            color: "#a0aec0",
            "&.Mui-checked": {
              color: "#00d4ff",
            },
          },
        }}
      />
    </Paper>
  );
};

export default TaskHistory;
