# 🚀 Alkor ERP - Quick Reference Guide

**For Fast Lookup & Common Tasks**

---

## 📂 File Locations Quick Reference

| Need | File Location |
|------|--------------|
| **Global Notifications** | `src/context/ToastContext.jsx` |
| **Login Page** | `src/pages/Auth/Login.jsx` |
| **Signup Page** | `src/pages/Auth/Signup.jsx` |
| **Employee Dashboard** | `src/pages/Employee/EmployeeCockpit.jsx` |
| **Head Dashboard** | `src/pages/admin-side/Head.jsx` |
| **HR Dashboard** | `src/pages/admin-side/HRDashboard.jsx` |
| **CEO Dashboard** | `src/pages/admin-side/Admin.jsx` |
| **Time Tracking** | `src/components/AttendanceWidget.jsx` |
| **Real-time Chat** | `src/components/TeamChat.jsx` |
| **Project List** | `src/components/dashboard/ProjectsPreview.jsx` |
| **Submit Report** | `src/components/dashboard/WorkReportForm.jsx` |
| **View Reports** | `src/components/dashboard/UserReportsList.jsx` |
| **Navigation Menu** | `src/components/layout/Sidebar.jsx` |
| **Top Header** | `src/components/layout/Topbar.jsx` |
| **App Configuration** | `src/App.jsx` |
| **Theme/Colors** | `src/theme.js` |

---

## 💻 Common Code Snippets

### 1. Using Toast Notifications

```javascript
import { useToast } from '../context/ToastContext';

export default function MyComponent() {
  const { showToast } = useToast();

  // Show success message (Green)
  const handleSuccess = () => {
    showToast('Task completed!', 'success');
  };

  // Show error message (Red)
  const handleError = () => {
    showToast('Something went wrong!', 'error');
  };

  // Show warning message (Orange)
  const handleWarning = () => {
    showToast('Please check your input!', 'warning');
  };

  // Show info message (Blue)
  const handleInfo = () => {
    showToast('New data available!', 'info');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleWarning}>Show Warning</button>
      <button onClick={handleInfo}>Show Info</button>
    </div>
  );
}
```

### 2. Fetching Data from API

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

export default function DataFetcher() {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        
        const response = await axios.get(
          'https://project-management-sodtware-backend-end.onrender.com/api/projects',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setData(response.data);
        showToast('Data loaded successfully!', 'success');
      } catch (err) {
        setError(err.message);
        showToast('Error loading data!', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {data && (
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 3. Form Submission

```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

export default function SubmitForm() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      showToast('Title is required!', 'warning');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        'https://project-management-sodtware-backend-end.onrender.com/api/tasks',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      showToast('Task created successfully!', 'success');
      
      // Clear form
      setFormData({
        title: '',
        description: '',
        priority: 'Medium'
      });

    } catch (error) {
      showToast('Error creating task!', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Task Title"
      />
      
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      
      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <button type="submit">Create Task</button>
    </form>
  );
}
```

### 4. Authentication Check

```javascript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const role = localStorage.getItem('adminRole');

    if (!token) {
      navigate('/admin');
      return;
    }

    // Role-based access
    if (role !== 'head') {
      navigate('/dashboard');
      return;
    }

  }, [navigate]);

  return (
    <div>
      <h1>This page is only for Heads</h1>
    </div>
  );
}
```

### 5. Conditional Rendering Based on Role

```javascript
export default function Dashboard() {
  const role = localStorage.getItem('adminRole');

  return (
    <div>
      {role === 'employee' && (
        <div>
          <h1>Employee Dashboard</h1>
          <p>Welcome Employee! Track your work here.</p>
        </div>
      )}

      {role === 'head' && (
        <div>
          <h1>Head Dashboard</h1>
          <p>Welcome Head! Manage your team here.</p>
        </div>
      )}

      {role === 'hr' && (
        <div>
          <h1>HR Dashboard</h1>
          <p>Welcome HR! Manage all employees here.</p>
        </div>
      )}

      {role === 'ceo' && (
        <div>
          <h1>CEO Dashboard</h1>
          <p>Welcome CEO! Full access to everything.</p>
        </div>
      )}
    </div>
  );
}
```

### 6. Using useState for Form Control

```javascript
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <form>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your Name"
      />
      
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Your Email"
      />
      
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Your Message"
      />

      <button type="button" onClick={handleReset}>Reset</button>
      <button type="submit">Send</button>
    </form>
  );
}
```

### 7. Using useEffect for Data Loading

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(
          'https://project-management-sodtware-backend-end.onrender.com/admin/projects',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setProjects(response.data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []); // Empty array = run once when component mounts

  if (loading) return <div>Loading projects...</div>;

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 8. Logout Function

```javascript
export default function MyComponent() {
  const handleLogout = () => {
    // Clear all stored data
    localStorage.clear();
    
    // Or clear specific items
    // localStorage.removeItem('adminToken');
    // localStorage.removeItem('adminRole');
    // localStorage.removeItem('userId');
    
    // Redirect to login
    window.location.href = '/admin';
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}
```

### 9. Passing Props to Components

```javascript
// Parent Component
import TaskCard from './components/TaskCard';

export default function TaskList() {
  const tasks = [
    { id: 1, title: 'Task 1', priority: 'High' },
    { id: 2, title: 'Task 2', priority: 'Medium' }
  ];

  return (
    <div>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          title={task.title}
          priority={task.priority}
          onDelete={() => console.log('Delete:', task.id)}
        />
      ))}
    </div>
  );
}

// Child Component (TaskCard)
export default function TaskCard({ title, priority, onDelete }) {
  return (
    <div>
      <h3>{title}</h3>
      <p>Priority: {priority}</p>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}
```

### 10. Delete with Confirmation

```javascript
import { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

export default function DeleteTask({ taskId }) {
  const { showToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `https://project-management-sodtware-backend-end.onrender.com/api/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      showToast('Task deleted successfully!', 'success');
      setShowConfirm(false);
    } catch (error) {
      showToast('Error deleting task!', 'error');
    }
  };

  return (
    <div>
      {!showConfirm ? (
        <button onClick={() => setShowConfirm(true)}>Delete</button>
      ) : (
        <div>
          <p>Are you sure?</p>
          <button onClick={handleDelete}>Yes, Delete</button>
          <button onClick={() => setShowConfirm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 Common Tasks & How-To

### How to: Add a New Page/Route

```javascript
// 1. Create new page file: src/pages/MyNewPage.jsx
export default function MyNewPage() {
  return <h1>My New Page</h1>;
}

// 2. Import in App.jsx
import MyNewPage from './pages/MyNewPage';

// 3. Add route in App.jsx
<Route path="/my-new-page" element={<MyNewPage />} />

// 4. Use in navigation
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/my-new-page');
```

### How to: Create a Modal/Dialog

```javascript
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';

export default function MyModal() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Modal</button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>My Modal</DialogTitle>
        <DialogContent>
          <p>Modal content goes here</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
```

### How to: Create a Table

```javascript
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

export default function MyTable() {
  const data = [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' }
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
```

### How to: Show Loading Spinner

```javascript
import { CircularProgress, Box } from '@mui/material';

export default function LoadingExample() {
  const [loading, setLoading] = useState(true);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <p>Data loaded!</p>
      )}
    </Box>
  );
}
```

### How to: Create a Card

```javascript
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

export default function MyCard() {
  return (
    <Card>
      <CardHeader title="Card Title" />
      <CardContent>
        <Typography>Card content goes here</Typography>
      </CardContent>
    </Card>
  );
}
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **"useToast must be used within a ToastProvider"** | Wrap your app with `<ToastProvider>` in App.jsx |
| **Token not found in localStorage** | Check if user logged in successfully |
| **API 401 Unauthorized** | Token expired or invalid. User needs to log in again |
| **API 403 Forbidden** | User doesn't have permission for this action |
| **Data not updating on screen** | Make sure to call `setState` (don't mutate state directly) |
| **Page blank after refresh** | Check if route is defined in App.jsx |
| **Button not responding** | Check if onClick handler is properly defined |
| **Modal won't close** | Make sure `onClose` handler sets state to false |
| **Console error: "Cannot read property 'xyz' of undefined"** | Check if data is loaded before accessing it |
| **Image not showing** | Check image path in `public/` or `assets/` folder |

---

## 📊 API Endpoints Reference

| Method | Endpoint | Purpose | Notes |
|--------|----------|---------|-------|
| POST | `/auth/login` | User login | Returns JWT token |
| POST | `/auth/signup` | User registration | Creates new account |
| GET | `/admin/projects` | Get all projects | Requires auth token |
| POST | `/admin/projects` | Create project | Requires auth token |
| PUT | `/admin/projects/:id` | Update project | Requires auth token |
| DELETE | `/admin/projects/:id` | Delete project | Requires auth token |
| GET | `/admin/tasks` | Get all tasks | Requires auth token |
| POST | `/admin/tasks` | Create task | Requires auth token |
| GET | `/admin/employees` | Get all employees | HR only |
| POST | `/admin/reports` | Submit work report | Employee only |
| GET | `/admin/reports` | Get reports | Based on role |

---

## 🎨 Material-UI Components Quick Guide

```javascript
// Buttons
import { Button } from '@mui/material';
<Button variant="contained">Save</Button>
<Button variant="outlined">Cancel</Button>
<Button variant="text">Skip</Button>

// Text Fields
import { TextField } from '@mui/material';
<TextField label="Username" />
<TextField label="Email" type="email" />
<TextField label="Comments" multiline rows={4} />

// Select Dropdown
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
<FormControl>
  <InputLabel>Status</InputLabel>
  <Select label="Status">
    <MenuItem value="pending">Pending</MenuItem>
    <MenuItem value="active">Active</MenuItem>
    <MenuItem value="completed">Completed</MenuItem>
  </Select>
</FormControl>

// Checkbox
import { Checkbox } from '@mui/material';
<Checkbox label="Remember me" />

// Box (Container)
import { Box } from '@mui/material';
<Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>Content</Box>

// Grid (Layout)
import { Grid } from '@mui/material';
<Grid container spacing={2}>
  <Grid item xs={12} sm={6}></Grid>
  <Grid item xs={12} sm={6}></Grid>
</Grid>

// Chip (Tag)
import { Chip } from '@mui/material';
<Chip label="Active" color="success" />

// Typography (Text)
import { Typography } from '@mui/material';
<Typography variant="h1">Heading 1</Typography>
<Typography variant="body1">Body text</Typography>

// Alert
import { Alert } from '@mui/material';
<Alert severity="success">Success message!</Alert>
<Alert severity="error">Error message!</Alert>
```

---

## 🎯 Development Checklist

When adding a new feature:

- [ ] Create component/page file
- [ ] Import necessary Material-UI components
- [ ] Add state management (useState/useContext)
- [ ] Add API calls with axios
- [ ] Add error handling
- [ ] Add success/error toast notifications
- [ ] Test form validation
- [ ] Test on different screen sizes (mobile, tablet, desktop)
- [ ] Check console for errors (F12)
- [ ] Test with real data from backend
- [ ] Add loading spinner while fetching
- [ ] Test logout and login flow
- [ ] Document your code with comments
- [ ] Run `npm run lint` to check code quality
- [ ] Get code review from team member

---

## 🚀 Deployment Checklist

Before pushing to production:

- [ ] All features tested locally
- [ ] No console errors (npm run build should have no warnings)
- [ ] All API endpoints are correct (not pointing to localhost)
- [ ] Environment variables set correctly
- [ ] No hardcoded passwords/keys
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] Testing on production-like environment
- [ ] Database backed up
- [ ] Rollback plan ready
- [ ] Team notified of deployment

---

## 💡 Performance Tips

1. **Use keys in lists**
   ```javascript
   {items.map(item => (
     <div key={item.id}>...</div>  // ✅ Good
   ))}
   ```

2. **Lazy load components**
   ```javascript
   const Component = lazy(() => import('./Component'));
   ```

3. **Memoize expensive computations**
   ```javascript
   import { useMemo } from 'react';
   const value = useMemo(() => expensiveFunction(), [dependency]);
   ```

4. **Optimize re-renders**
   ```javascript
   import { memo } from 'react';
   export default memo(MyComponent);
   ```

5. **Use async/await instead of .then()**
   ```javascript
   const data = await axios.get('/api/data');  // Cleaner
   ```

---

## 📱 Responsive Design Tips

```javascript
import { useMediaQuery, useTheme } from '@mui/material';

const MyComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
};
```

---

## 🔧 Debugging Tips

```javascript
// Log to console
console.log('Value:', myVariable);
console.error('Error:', error);
console.warn('Warning:', warning);

// Log component props
console.log('Props:', props);

// Check state changes
const [count, setCount] = useState(0);
useEffect(() => {
  console.log('Count changed:', count);
}, [count]);

// Check if useEffect runs
useEffect(() => {
  console.log('Component mounted');
  return () => console.log('Component unmounted');
}, []);
```

---

## 📞 Quick Support Contacts

- **Backend Issues?** Check Backend API endpoint
- **UI Not Looking Right?** Check MUI component props
- **State Not Updating?** Check setState is called correctly
- **Token Issues?** Check localStorage and headers
- **Network Issues?** Check Console > Network tab

---

**Created:** May 2026  
**Quick Reference Version:** 1.0

