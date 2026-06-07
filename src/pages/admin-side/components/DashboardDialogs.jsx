import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  Fade,
  IconButton,
  InputAdornment,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";

const formTextFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    background: "#fff",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#d1d5db" },
    "&.Mui-focused fieldset": { borderColor: "#1e40af" },
  },
  "& .MuiInputLabel-root": { color: "#6b7280", fontSize: "0.9rem" },
  "& .MuiInputBase-input": {
    color: "#1f2937",
    fontWeight: 500,
  },
};

const actionButtonStyle = {
  height: 48,
  background: "linear-gradient(90deg, #0f172a 0%, #1e40af 100%)",
  color: "#fff",
  borderRadius: "10px",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "1rem",
  boxShadow: "0 4px 12px rgba(30, 58, 138, 0.2)",
  "&:hover": {
    background: "linear-gradient(90deg, #020617 0%, #1e3a8a 100%)",
    boxShadow: "0 6px 16px rgba(30, 58, 138, 0.3)",
  }
};

const DashboardDialogs = ({
  // User Dialog Props
  openUserDialog,
  handleUserDialogClose,
  editingUser,
  userForm,
  setUserForm,
  handleUserSubmit,
  DEPARTMENTS,

  // Responsible Dialog Props
  openResponsibleDialog,
  handleResponsibleDialogClose,
  responsibleForm,
  setResponsibleForm,
  handleResponsibleSubmit,
  editingAdmin,
  POSTS,

  // Department Dialog Props
  openDeptDialog,
  handleDeptDialogClose,
  editingDept,
  deptForm,
  setDeptForm,
  handleDeptSubmit,

  // Delete Dialog Props
  openDeleteDialog,
  cancelDeleteUser,
  userToDelete,
  confirmDeleteUser,

  // Password Dialog Props
  openPasswordDialog,
  handlePasswordDialogClose,
  passwordForm,
  setPasswordForm,
  handlePasswordSubmit,
}) => {
  const [showPasswordUser, setShowPasswordUser] = useState(false);
  const [showPasswordResponsible, setShowPasswordResponsible] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);

  const formatDepartment = (dept) => {
    if (!dept) return "";
    if (typeof dept === "string") return dept;
    return dept.title || dept.name || dept.department || dept.departmentName || JSON.stringify(dept);
  };

  const departmentKey = (dept, index) => {
    if (!dept) return `dept-${index}`;
    if (typeof dept === "string") return dept;
    return dept._id || dept.Dep_id || dept.title || dept.name || dept.department || dept.departmentName || `dept-${index}`;
  };

  return (
    <>
      {/* USER DIALOG */}
      <Dialog
        open={openUserDialog}
        onClose={handleUserDialogClose}
        TransitionComponent={Fade}
        transitionDuration={400}
        PaperProps={{
          sx: {
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            width: "100%",
            maxWidth: "420px !important"
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 3, pb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "#374151" }}>
            {editingUser ? "Edit Profile" : "User Management"}
          </Typography>
          <IconButton onClick={handleUserDialogClose} size="small" sx={{ color: "#9ca3af" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 4, pt: 2 }}>
          <Stack spacing={2.5}>
            <TextField
              placeholder="Enter employee name"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              fullWidth
              size="medium"
              sx={formTextFieldStyle}
            />
            <TextField
              placeholder="Enter email address"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              fullWidth
              sx={formTextFieldStyle}
            />
            <FormControl fullWidth>
              <Select
                value={userForm.department}
                onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                displayEmpty
                sx={{
                  borderRadius: "10px",
                  background: "#fff",
                  "& .MuiSelect-select": {
                    color: userForm.department ? "#1f2937" : "#9ca3af",
                    fontWeight: 500,
                  },
                  "& fieldset": { borderColor: "#e5e7eb" },
                }}
              >
                <MenuItem value="" disabled>Department</MenuItem>
                {DEPARTMENTS.map((dept, idx) => {
                  const label = formatDepartment(dept);
                  const key = departmentKey(dept, idx);
                  return (
                    <MenuItem key={key} value={label}>
                      {label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {!editingUser && (
              <TextField
                placeholder="Password"
                type={showPasswordUser ? "text" : "password"}
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPasswordUser(!showPasswordUser)}
                        edge="end"
                        sx={{ color: "#9ca3af" }}
                      >
                        {showPasswordUser ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={formTextFieldStyle}
              />
            )}
            <Button
              variant="contained"
              onClick={handleUserSubmit}
              fullWidth
              sx={actionButtonStyle}
            >
              {editingUser ? "Apply Update" : "Submit"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* RESPONSIBLE DIALOG */}
      <Dialog
        open={openResponsibleDialog}
        onClose={handleResponsibleDialogClose}
        TransitionComponent={Fade}
        transitionDuration={400}
        PaperProps={{
          sx: {
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            width: "100%",
            maxWidth: "420px !important"
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 3, pb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "#374151" }}>
            {editingAdmin ? "Edit Profile" : "User Management"}
          </Typography>
          <IconButton onClick={handleResponsibleDialogClose} size="small" sx={{ color: "#9ca3af" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 4, pt: 2 }}>
          <Stack spacing={2.5}>
            <TextField
              placeholder="Enter head name"
              value={responsibleForm.name}
              onChange={(e) => setResponsibleForm({ ...responsibleForm, name: e.target.value })}
              fullWidth
              sx={formTextFieldStyle}
            />
            <TextField
              placeholder="Enter email address"
              value={responsibleForm.email}
              onChange={(e) => setResponsibleForm({ ...responsibleForm, email: e.target.value })}
              fullWidth
              sx={formTextFieldStyle}
            />
            <TextField
              placeholder="Enter role"
              value={responsibleForm.post}
              onChange={(e) => setResponsibleForm({ ...responsibleForm, post: e.target.value })}
              fullWidth
              sx={formTextFieldStyle}
            />
            <FormControl fullWidth>
              <Select
                value={responsibleForm.department}
                onChange={(e) => setResponsibleForm({ ...responsibleForm, department: e.target.value })}
                displayEmpty
                sx={{
                  borderRadius: "10px",
                  background: "#fff",
                  "& .MuiSelect-select": {
                    color: responsibleForm.department ? "#1f2937" : "#9ca3af",
                    fontWeight: 500,
                  },
                  "& fieldset": { borderColor: "#e5e7eb" },
                }}
              >
                <MenuItem value="" disabled>Department</MenuItem>
                {DEPARTMENTS.map((dept, idx) => {
                  const label = formatDepartment(dept);
                  const key = departmentKey(dept, idx);
                  return (
                    <MenuItem key={key} value={label}>
                      {label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {!editingAdmin && (
              <TextField
                placeholder="password"
                type={showPasswordResponsible ? "text" : "password"}
                value={responsibleForm.password}
                onChange={(e) => setResponsibleForm({ ...responsibleForm, password: e.target.value })}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPasswordResponsible(!showPasswordResponsible)}
                        edge="end"
                        sx={{ color: "#9ca3af" }}
                      >
                        {showPasswordResponsible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={formTextFieldStyle}
              />
            )}
            <Button
              variant="contained"
              onClick={handleResponsibleSubmit}
              fullWidth
              sx={actionButtonStyle}
            >
              {editingAdmin ? "Apply Update" : "Submit"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* DEPARTMENT DIALOG */}
      <Dialog
        open={openDeptDialog}
        onClose={handleDeptDialogClose}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            width: "100%",
            maxWidth: "400px !important"
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 3, pb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "#374151" }}>
            {editingDept ? "Edit Department" : "Add Department"}
          </Typography>
          <IconButton onClick={handleDeptDialogClose} size="small" sx={{ color: "#9ca3af" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 4, pt: 2 }}>
          <Stack spacing={2.5}>
            <TextField
              placeholder="Department ID"
              value={deptForm.id || deptForm.Dep_id}
              onChange={(e) => setDeptForm({ ...deptForm, id: e.target.value })}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "14px", background: "rgba(255, 255, 255, 0.3)" },
                "& .MuiInputLabel-root": { color: "#000", fontWeight: 700 },
                "& .MuiInputBase-input": { color: "#000", fontWeight: 800 }
              }}
            />
            <TextField
              label="Department Name"
              value={deptForm.title}
              onChange={(e) => setDeptForm({ ...deptForm, title: e.target.value })}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "14px", background: "rgba(255, 255, 255, 0.3)" },
                "& .MuiInputLabel-root": { color: "#000", fontWeight: 700 },
                "& .MuiInputBase-input": { color: "#000", fontWeight: 800 }
              }}
            />
            <TextField
              label="Department Color"
              value={deptForm.color || "#ffff"}
              InputProps={{ readOnly: true }}
              fullWidth
              helperText="Using default color #ffff for department tags"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "14px", background: "rgba(255, 255, 255, 0.3)" },
                "& .MuiInputLabel-root": { color: "#000", fontWeight: 700 },
                "& .MuiInputBase-input": { color: "#000", fontWeight: 800 }
              }}
            />
            <TextField
              label="Description"
              value={deptForm.description}
              multiline
              rows={3}
              onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "14px", background: "rgba(255, 255, 255, 0.3)" },
                "& .MuiInputLabel-root": { color: "#000", fontWeight: 700 },
                "& .MuiInputBase-input": { color: "#000", fontWeight: 800 }
              }}
            />
            <Button
              variant="contained"
              onClick={handleDeptSubmit}
              fullWidth
              sx={actionButtonStyle}
            >
              Save Department
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog
        open={openDeleteDialog}
        onClose={cancelDeleteUser}
        PaperProps={{
          sx: {
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            p: 1
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#e11d48",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontWeight: 900,
          }}
        >
          <WarningIcon /> Security Override
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "rgba(0,0,0,0.6)", fontWeight: 700, mb: 2 }}>
            Confirm immediate deletion of <b>{userToDelete?.name}</b>. This state change is permanent.
          </Typography>
          <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              onClick={cancelDeleteUser}
              sx={{ color: "rgba(0,0,0,0.4)", fontWeight: 800 }}
            >
              Abort
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "rgba(225, 29, 72, 0.1)",
                color: "#e11d48",
                fontWeight: 900,
                "&:hover": { bgcolor: "rgba(225, 29, 72, 0.2)" }
              }}
              onClick={confirmDeleteUser}
            >
              Execute Deletion
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* EDIT PASSWORD DIALOG */}
      <Dialog
        open={openPasswordDialog}
        onClose={handlePasswordDialogClose}
        TransitionComponent={Fade}
        transitionDuration={400}
        PaperProps={{
          sx: {
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            width: "100%",
            maxWidth: "400px !important"
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 3, pb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "#374151" }}>
            Reset Access Key
          </Typography>
          <IconButton onClick={handlePasswordDialogClose} size="small" sx={{ color: "#9ca3af" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 4, pt: 2 }}>
          <Stack spacing={3}>
            <TextField
              label="Employee Email"
              value={passwordForm.email}
              fullWidth
              disabled
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  background: "rgba(255, 255, 255, 0.35)",
                  "& fieldset": { borderColor: "rgba(0,0,0,0.05)" },
                },
                "& .MuiInputLabel-root": { color: "#000", fontWeight: 700 },
                "& .MuiInputBase-input": {
                  color: "#000",
                  fontWeight: 800,
                },
                "& .Mui-disabled": {
                  WebkitTextFillColor: "rgba(0,0,0,0.6) !important",
                }
              }}
            />
            <TextField
              label="New Password"
              type={showPasswordEdit ? "text" : "password"}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              fullWidth
              autoFocus
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswordEdit(!showPasswordEdit)}
                      edge="end"
                      sx={{ color: "rgba(0,0,0,0.4)" }}
                    >
                      {showPasswordEdit ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  background: "rgba(255, 255, 255, 0.35)",
                  "& fieldset": { borderColor: "rgba(0,0,0,0.05)" },
                },
                "& .MuiInputLabel-root": { color: "#000", fontWeight: 700 },
                "& .MuiInputBase-input": {
                  color: "#000",
                  fontWeight: 800,
                  "&::-ms-reveal": { display: "none" },
                  "&::-ms-clear": { display: "none" },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handlePasswordSubmit}
              fullWidth
              sx={actionButtonStyle}
            >
              Update Credentials
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardDialogs;