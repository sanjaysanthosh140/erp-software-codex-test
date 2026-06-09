// import React, { useState, useEffect } from "react";
// import {
//   Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, Paper,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, alpha, Tooltip,
//   CircularProgress
// } from "@mui/material";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// import axios from "axios";

// const ACCENT = "#0f766e";
// const BORDER = "rgba(15, 23, 42, 0.08)";

// export default function EverythingComponent({ open, onClose }) {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("adminToken");
//   const fetchProjects = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("https://project-management-sodtware-backend-end.onrender.com/admin/simple_custom_projects", {
//         headers: { Authorization: token }
//       });
//       setProjects(res.data || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (open) {
//       fetchProjects();
//     }
//   }, [open]);

//   const allSelectedDeptNames = Array.from(new Set(projects.flatMap(p => (p.departments || []).map(d => d.departmentName))));

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl" PaperProps={{ sx: { borderRadius: "20px", height: "85vh", display: "flex", flexDirection: "column" } }}>
//       <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${BORDER}`, bgcolor: "#fff", px: 3, py: 2 }}>
//         <Box>
//           <Typography sx={{ fontWeight: 800, fontSize: "1.2rem", color: "#0f172a" }}>Hybrid Project Workflow Overview</Typography>
//           <Typography variant="caption" sx={{ color: "#64748b" }}>Live status of all departments</Typography>
//         </Box>
//         <IconButton onClick={onClose} size="small" sx={{ bgcolor: alpha("#0f172a", 0.05) }}><CloseRoundedIcon /></IconButton>
//       </DialogTitle>
      
//       <DialogContent sx={{ p: 0, bgcolor: "#f8fafc", flex: 1, overflowY: "auto" }}>
//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
//             <CircularProgress sx={{ color: ACCENT }} />
//           </Box>
//         ) : (
//           <Box sx={{ p: 3 }}>
//             <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "16px", border: `1px solid ${BORDER}` }}>
//               <Table>
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: "#f1f5f9" }}>
//                     <TableCell sx={{ fontWeight: 800, color: "#334155", py: 2 }}>Project Name</TableCell>
//                     {allSelectedDeptNames.map(deptName => (
//                       <TableCell key={deptName} align="center" sx={{ fontWeight: 800, color: "#334155" }}>{deptName}</TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {projects.map(proj => (
//                     <TableRow key={proj._id} sx={{ "&:last-child td, &:last-child th": { border: 0 }, "&:hover": { bgcolor: alpha(ACCENT, 0.02) } }}>
//                       <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>{proj.projectTilte || proj.projectTitle || "Unnamed Project"}</TableCell>
//                       {allSelectedDeptNames.map(deptName => {
//                         const deptInfo = (proj.departments || []).find(d => d.departmentName === deptName);
//                         if (!deptInfo) return <TableCell key={deptName} align="center" sx={{ color: "#cbd5e1" }}>—</TableCell>;
                        
//                         const isPending = deptInfo.dept_status === "pending";
//                         const isCompleted = deptInfo.dept_status === "completed";
//                         const isProgress = deptInfo.dept_status === "progress";
                        
//                         return (
//                           <TableCell key={deptName} align="center">
//                             <Tooltip title={isPending && deptInfo.pending_reason ? `Reason: ${deptInfo.pending_reason}` : "Status"}>
//                               <Chip 
//                                 label={deptInfo.dept_status || "pending"} 
//                                 sx={{ 
//                                   fontWeight: 800, 
//                                   fontSize: "0.7rem",
//                                   textTransform: "uppercase",
//                                   bgcolor: isCompleted ? "#dcfce7" : isProgress ? "#fef3c7" : "#f1f5f9",
//                                   color: isCompleted ? "#166534" : isProgress ? "#92400e" : "#475569",
//                                   border: `1px solid ${isCompleted ? "#bbf7d0" : isProgress ? "#fde68a" : "#e2e8f0"}`
//                                 }} 
//                               />
//                             </Tooltip>
//                             {isPending && deptInfo.pending_reason && (
//                               <Typography variant="caption" sx={{ display: "block", color: "#ef4444", mt: 0.5, fontWeight: 600, fontSize: "0.65rem", maxWidth: "120px", mx: "auto", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                                 {deptInfo.pending_reason}
//                               </Typography>
//                             )}
//                           </TableCell>
//                         );
//                       })}
//                     </TableRow>
//                   ))}
//                   {projects.length === 0 && (
//                     <TableRow>
//                       <TableCell colSpan={allSelectedDeptNames.length + 1} align="center" sx={{ py: 6, color: "#94a3b8" }}>
//                         No hybrid projects found.
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }
