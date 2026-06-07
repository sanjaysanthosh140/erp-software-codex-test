import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API_BASE_URL = "http://localhost:8080";

/** Select value to load tasks/subtasks from every project the employee is on */
const ALL_PROJECTS_VALUE = "__ALL_PROJECTS__";

const toLocalISOHeadTask = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ceoHeadTaskAssignerFromJwt = () => {
  const base = { role: "ceo", assignedByRole: "ceo" };
  try {
    const token = localStorage.getItem("adminToken");
    if (!token) return { ...base, assignedByName: undefined };
    const payload = JSON.parse(atob(token.split(".")[1]));
    const name = payload.name || payload.email;
    return { ...base, assignedByName: name || undefined };
  } catch {
    return { ...base, assignedByName: undefined };
  }
};

const formatHeadTaskAssignmentSource = (task) => {
  const r = (task.role || task.assignedByRole || "").toLowerCase();
  if (r === "ceo" || r === "admin" || r === "superadmin") {
    return task.assignedByName ? `CEO · ${task.assignedByName}` : "CEO / Management";
  }
  if (r === "hr") {
    return task.assignedByName ? `HR · ${task.assignedByName}` : "HR";
  }
  return "HR (legacy)";
};

/** Partition key for CEO dashboard list styling */
const getHeadTaskPartition = (task) => {
  const r = (task.role || task.assignedByRole || "").toLowerCase();
  if (r === "hr") return "hr";
  if (r === "ceo" || r === "admin" || r === "superadmin") return "ceo";
  return "legacy";
};

const HEAD_TASK_PARTITION_STYLES = {
  ceo: {
    sectionBg: "linear-gradient(180deg, #eef2ff 0%, #ffffff 100%)",
    sectionBorder: "1px solid #a5b4fc",
    sectionTitle: "#312e81",
    accentBar: "#4f46e5",
    cardBorder: "1px solid #c7d2fe",
    cardBg: "#f5f7ff",
    cardLeft: "4px solid #4f46e5",
    ribbonBg: "#4f46e5",
    ribbonColor: "#ffffff",
    ribbonLabel: "CEO",
  },
  hr: {
    sectionBg: "linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%)",
    sectionBorder: "1px solid #86efac",
    sectionTitle: "#14532d",
    accentBar: "#16a34a",
    cardBorder: "1px solid #bbf7d0",
    cardBg: "#f0fdf4",
    cardLeft: "4px solid #16a34a",
    ribbonBg: "#16a34a",
    ribbonColor: "#ffffff",
    ribbonLabel: "HR",
  },
  legacy: {
    sectionBg: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
    sectionBorder: "1px solid #cbd5e1",
    sectionTitle: "#334155",
    accentBar: "#64748b",
    cardBorder: "1px solid #e2e8f0",
    cardBg: "#f8fafc",
    cardLeft: "4px solid #94a3b8",
    ribbonBg: "#64748b",
    ribbonColor: "#ffffff",
    ribbonLabel: "Unlabeled",
  },
};

function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole") || "";
    if (!token || role.toLowerCase() !== "ceo") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin");
  };

  const authHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
    }),
    [],
  );

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectData, setProjectData] = useState(null);
  const [employeeReports, setEmployeeReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [error, setError] = useState("");

  const [headAdmins, setHeadAdmins] = useState([]);
  const [headTasks, setHeadTasks] = useState([]);
  const [headTasksLoading, setHeadTasksLoading] = useState(false);
  const [headTaskBanner, setHeadTaskBanner] = useState({ type: "", message: "" });
  const [headTaskForm, setHeadTaskForm] = useState({
    headId: "",
    task: "",
    priority: "Medium",
    assignedDate: toLocalISOHeadTask(new Date()),
    deadline: "",
  });
  const [editingHeadTask, setEditingHeadTask] = useState(null);

  const fetchCeoHeadTasksData = async () => {
    setHeadTasksLoading(true);
    try {
      const [admRes, tasksRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/get_admins`, { headers: authHeaders }),
        axios.get(`${API_BASE_URL}/admin/hr_assigned_tasks`, { headers: authHeaders }),
      ]);
      setHeadAdmins(Array.isArray(admRes.data) ? admRes.data : []);
      setHeadTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
    } catch (e) {
      console.error(e);
      setHeadTaskBanner({ type: "err", message: "Could not load department heads or their tasks." });
    } finally {
      setHeadTasksLoading(false);
    }
  };

  useEffect(() => {
    fetchCeoHeadTasksData();
  }, [authHeaders]);

  const handleCeoHeadTaskSubmit = async () => {
    if (!headTaskForm.headId || !headTaskForm.task.trim() || !headTaskForm.deadline) {
      setHeadTaskBanner({
        type: "err",
        message: "Choose a head, enter the task, and set a deadline.",
      });
      return;
    }
    const payload = {
      headId: headTaskForm.headId,
      admin: localStorage.getItem("adminRole"),
      title: headTaskForm.task.trim(),
      priority: headTaskForm.priority,
      assignedDate: headTaskForm.assignedDate,
      deadline: headTaskForm.deadline,
      ...(editingHeadTask ? {} : ceoHeadTaskAssignerFromJwt()),
    };
    try {
      setHeadTasksLoading(true);
      if (editingHeadTask) {
        //  same in hr dasboard api reused  
        await axios.put(`${API_BASE_URL}/admin/hr_assigned_tasks/${editingHeadTask._id}`, payload);
        setHeadTaskBanner({ type: "ok", message: "Head task updated." });
      } else {
        console.log(payload);
        await axios.post(`${API_BASE_URL}/admin/hr_assigned_tasks`, payload);
        setHeadTaskBanner({ type: "ok", message: "Task assigned to head (tracked as CEO)." });
      }
      setEditingHeadTask(null);
      setHeadTaskForm({
        headId: "",
        task: "",
        priority: "Medium",
        assignedDate: toLocalISOHeadTask(new Date()),
        deadline: "",
      });
      await fetchCeoHeadTasksData();
    } catch (e) {
      console.error(e);
      setHeadTaskBanner({ type: "err", message: "Could not save head task." });
    } finally {
      setHeadTasksLoading(false);
    }
  };

  const handleEditCeoHeadTask = (task) => {
    setEditingHeadTask(task);
    setHeadTaskForm({
      headId: task.headId || "",
      task: task.title || task.desc || "",
      priority: task.priority || "Medium",
      assignedDate: task.assignedDate
        ? toLocalISOHeadTask(task.assignedDate)
        : toLocalISOHeadTask(new Date()),
      deadline: task.deadline ? toLocalISOHeadTask(task.deadline) : "",
    });
  };

  const handleDeleteCeoHeadTask = async (id) => {
    if (!window.confirm("Remove this assignment for the head?")) return;
    try {
      setHeadTasksLoading(true);
      await axios.delete(`${API_BASE_URL}/admin/hr_assigned_tasks/${id}`);
      setHeadTaskBanner({ type: "ok", message: "Task removed." });
      if (editingHeadTask?._id === id) {
        setEditingHeadTask(null);
        setHeadTaskForm({
          headId: "",
          task: "",
          priority: "Medium",
          assignedDate: toLocalISOHeadTask(new Date()),
          deadline: "",
        });
      }
      await fetchCeoHeadTasksData();
    } catch (e) {
      console.error(e);
      setHeadTaskBanner({ type: "err", message: "Could not delete task." });
    } finally {
      setHeadTasksLoading(false);
    }
  };

  const cancelEditCeoHeadTask = () => {
    setEditingHeadTask(null);
    setHeadTaskForm({
      headId: "",
      task: "",
      priority: "Medium",
      assignedDate: toLocalISOHeadTask(new Date()),
      deadline: "",
    });
  };

  const formatDueDate = (value) => {
    if (!value) return "N/A";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString("en-GB");
  };

  const normalizeTasksWithSubTasks = (taskRows = [], todoRows = [], projectId) => {
    return taskRows.map((row, index) => {
      const task = row?.employeeTasks?.tasks || {};
      const currentTaskId = task?.task_id;
      const staticSubTasks =
        row?.employeeTasks?.todolist || task?.todolist || task?.subTasks || [];

      const matchedTodo = Array.isArray(todoRows)
        ? todoRows.find(
          (todo) => todo?.task_id === currentTaskId && todo?.project_id === projectId,
        )
        : null;

      const fetchedSubTasks = Array.isArray(matchedTodo?.user_subTaks)
        ? matchedTodo.user_subTaks.map((st) => ({
          todo_id: st.todo_id,
          title: st.title,
          status: st.status || "pending",
          createdAt: st.createdAt,
        }))
        : [];

      const finalSubTasks = matchedTodo ? fetchedSubTasks : staticSubTasks;
      return {
        ...task,
        headName: row?.headName || "Not assigned",
        _id:
          matchedTodo?._id ||
          row?.employeeTasks?._id ||
          row?._id ||
          `admin-task-${index}-${Date.now()}`,
        task_id: currentTaskId || `task-${index}`,
        subTasks: finalSubTasks,
      };
    });
  };

  const calculatedProgress = useMemo(() => {
    const todos = projectData?.todos || [];
    if (todos.length === 0) return 0;
    const weightedDone = todos.reduce((acc, todo) => {
      if (todo.status === "completed") return acc + 1;
      if (todo.subTasks?.length > 0) {
        const doneSubtasks = todo.subTasks.filter(
          (sub) => sub.status === "completed",
        ).length;
        return acc + doneSubtasks / todo.subTasks.length;
      }
      return acc;
    }, 0);
    return Math.round((weightedDone / todos.length) * 100);
  }, [projectData]);

  const partitionedHeadTasks = useMemo(() => {
    const ceo = [];
    const hr = [];
    const legacy = [];
    for (const task of headTasks) {
      const p = getHeadTaskPartition(task);
      if (p === "ceo") ceo.push(task);
      else if (p === "hr") hr.push(task);
      else legacy.push(task);
    }
    return { ceo, hr, legacy };
  }, [headTasks]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${API_BASE_URL}/admin/users`, {
          headers: authHeaders,
        });
        console.log(res.data);
        const list = Array.isArray(res.data) ? res.data : [];
        setEmployees(list);
        if (list.length > 0) setSelectedEmployeeId(list[0]._id);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [authHeaders]);

  useEffect(() => {
    const fetchEmployeeProjects = async () => {
      if (!selectedEmployeeId) return;
      try {
        setLoading(true);
        setError("");
        const projectRes = await axios.get(`${API_BASE_URL}/employee_included_proj`, {
          headers: authHeaders,
          params: { empId: selectedEmployeeId },
        });
        const list = Array.isArray(projectRes.data) ? projectRes.data : [];
        setProjects(list);
        if (list.length > 0) {
          setSelectedProjectId((prev) => {
            if (prev === ALL_PROJECTS_VALUE) return ALL_PROJECTS_VALUE;
            if (prev && list.some((proj) => proj._id === prev)) return prev;
            return list[0]._id;
          });
        } else {
          setSelectedProjectId("");
          setProjectData(null);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch selected employee projects");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeProjects();
  }, [selectedEmployeeId, authHeaders]);

  useEffect(() => {
    const fetchSelectedEmployeeReports = async () => {
      if (!selectedEmployeeId) {
        setEmployeeReports([]);
        return;
      }
      try {
        setReportsLoading(true);
        const reportRes = await axios.get(
          `${API_BASE_URL}/admin/reports/employee/${selectedEmployeeId}`,
          {
            headers: authHeaders,
          },
        );
        const rows = Array.isArray(reportRes.data) ? reportRes.data : [];
        const latestFirst = rows.sort((a, b) => {
          const aTime = new Date(a?.date || a?.createdAt || 0).getTime();
          const bTime = new Date(b?.date || b?.createdAt || 0).getTime();
          return bTime - aTime;
        });
        setEmployeeReports(latestFirst);
      } catch (err) {
        console.error(err);
        setEmployeeReports([]);
      } finally {
        setReportsLoading(false);
      }
    };
    fetchSelectedEmployeeReports();
  }, [selectedEmployeeId, authHeaders]);

  useEffect(() => {
    const fetchProjectTasks = async () => {
      if (!selectedEmployeeId || !selectedProjectId) return;
      if (!projects.length) {
        setProjectData(null);
        return;
      }
      try {
        setLoading(true);
        setError("");
        if (selectedProjectId === ALL_PROJECTS_VALUE) {
          const todoRes = await axios.get(`${API_BASE_URL}/achive_created_todo_list`, {
            headers: authHeaders,
            params: { empId: selectedEmployeeId },
          });
          const todoRows = todoRes.data;
          console.log(todoRes.data);
          const taskResults = await Promise.all(
            projects.map((proj) =>
              axios
                .get(`${API_BASE_URL}/emp_proj-tasks/${proj._id}`, {
                  headers: authHeaders,
                  params: { empId: selectedEmployeeId },
                })
                .then((res) => ({ project: proj, rows: res.data }))
                .catch(() => ({ project: proj, rows: [] })),
            ),
          );
          const mergedTodos = [];
          for (const { project, rows } of taskResults) {
            const normalized = normalizeTasksWithSubTasks(rows || [], todoRows, project._id);
            for (const t of normalized) {
              mergedTodos.push({
                ...t,
                sourceProjectId: project._id,
                sourceProjectTitle: project.title || "Untitled Project",
              });
            }
          }
          setProjectData({
            _id: ALL_PROJECTS_VALUE,
            title: "All projects",
            todos: mergedTodos,
          });
        } else {
          const [taskRes, todoRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/emp_proj-tasks/${selectedProjectId}`, {
              headers: authHeaders,
              params: { empId: selectedEmployeeId },
            }),
            axios.get(`${API_BASE_URL}/achive_created_todo_list`, {
              headers: authHeaders,
              params: { empId: selectedEmployeeId },
            }),
          ]);
          const selectedProject = projects.find((p) => p._id === selectedProjectId) || null;
          if (!selectedProject) {
            setProjectData(null);
            return;
          }
          console.log(taskRes.data);
          const normalizedTodos = normalizeTasksWithSubTasks(
            taskRes.data,
            todoRes.data,
            selectedProjectId,
          );
          setProjectData({ ...selectedProject, todos: normalizedTodos });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch project tasks/subtasks");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectTasks();
  }, [selectedEmployeeId, selectedProjectId, authHeaders, projects]);

  const selectedEmployee =
    employees.find((employee) => employee._id === selectedEmployeeId) || null;

  const totalTasks = projectData?.todos?.length || 0;
  const completedTasks =
    projectData?.todos?.filter((task) => {
      const taskStatus = (task?.status || "").toString().toLowerCase();
      if (taskStatus === "completed" || taskStatus === "done") return true;
      const subtasks = Array.isArray(task?.subTasks) ? task.subTasks : [];
      if (subtasks.length === 0) return false;
      return subtasks.every(
        (sub) => (sub?.status || "").toString().toLowerCase() === "completed",
      );
    }).length || 0;
  const totalSubTasks =
    projectData?.todos?.reduce(
      (count, task) => count + (Array.isArray(task.subTasks) ? task.subTasks.length : 0),
      0,
    ) || 0;
  const completedSubTasks =
    projectData?.todos?.reduce(
      (count, task) =>
        count +
        (Array.isArray(task.subTasks)
          ? task.subTasks.filter((sub) => sub.status === "completed").length
          : 0),
      0,
    ) || 0;

  return (
    <div id="admin-emp-dash" className="adm-page-bg">
      <div className="adm-shell">
        <header className="adm-hero">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="adm-eyebrow">Operations</p>
              <h2 className="adm-title">Admin employee work dashboard</h2>
              <p className="adm-lede">
                Select an employee, view included projects, then inspect assigned tasks and
                completed subtasks.
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="adm-logout-btn"
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                padding: '8px 16px',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                marginTop: '10px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#fecaca';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#fee2e2';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        {error ? <div className="adm-alert">{error}</div> : null}

        <div className="adm-controls">
          <div className="adm-field-card">
            <label htmlFor="employee-select" className="adm-label">
              Employees
            </label>
            <select
              id="employee-select"
              className="adm-select"
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
            >
              {employees.map((employee) => {
                const displayName = employee.name || employee.email || employee._id;
                const dept =
                  employee.department || employee.dept || employee.departmentName || "No department";
                return (
                  <option key={employee._id} value={employee._id}>
                    {`${displayName} — ${dept}`}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="adm-field-card">
            <label htmlFor="project-select" className="adm-label">
              Included projects
            </label>
            <select
              id="project-select"
              className="adm-select"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.length > 0 ? (
                <option value={ALL_PROJECTS_VALUE}>All projects</option>
              ) : null}
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title || "Untitled Project"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="adm-stats">
          <StatCard accent title="Employee" value={selectedEmployee?.name || "-"} />
          <StatCard title="Assigned tasks" value={totalTasks} />
          <StatCard title="Completed tasks" value={completedTasks} />
          <StatCard title="Subtasks done" value={`${completedSubTasks}/${totalSubTasks}`} />
        </div>

        <div className="adm-progress-card">
          <div className="adm-progress-head">
            <strong>Overall progress</strong>
            <span className="adm-progress-pct">{calculatedProgress}%</span>
          </div>
          <div className="adm-progress-track">
            <div className="adm-progress-fill" style={{ width: `${calculatedProgress}%` }} />
          </div>
        </div>

        <section className="adm-ceo-section">
          <h3 className="adm-ceo-title">Assign tasks to department heads (CEO)</h3>
          <p className="adm-ceo-copy">
            Same workflow as HR: tasks are stored on <code>/admin/hr_assigned_tasks</code>.
            New tasks from this dashboard are labeled <strong>CEO</strong> so heads can tell them apart from{" "}
            <strong>HR</strong> assignments.
          </p>
          {headTaskBanner.message ? (
            <div
              className={`adm-banner ${headTaskBanner.type === "ok" ? "adm-banner--ok" : "adm-banner--err"}`}
            >
              {headTaskBanner.message}
            </div>
          ) : null}
          <div className="adm-form-grid">
            <div>
              <label className="adm-form-label" htmlFor="head-task-head">
                Head
              </label>
              <select
                id="head-task-head"
                className="adm-select"
                value={headTaskForm.headId}
                onChange={(e) => setHeadTaskForm((p) => ({ ...p, headId: e.target.value }))}
                style={{ marginTop: "6px" }}
              >
                <option value="">Choose head</option>
                {headAdmins.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name} — {a.department || a.role || "No dept"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="adm-form-label" htmlFor="head-task-priority">
                Priority
              </label>
              <select
                id="head-task-priority"
                className="adm-select"
                value={headTaskForm.priority}
                onChange={(e) => setHeadTaskForm((p) => ({ ...p, priority: e.target.value }))}
                style={{ marginTop: "6px" }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="adm-form-label" htmlFor="head-task-assigned">
                Assigned date
              </label>
              <input
                id="head-task-assigned"
                type="date"
                className="adm-input-date"
                value={headTaskForm.assignedDate}
                onChange={(e) => setHeadTaskForm((p) => ({ ...p, assignedDate: e.target.value }))}
                style={{ marginTop: "6px" }}
              />
            </div>
            <div>
              <label className="adm-form-label" htmlFor="head-task-deadline">
                Deadline
              </label>
              <input
                id="head-task-deadline"
                type="date"
                className="adm-input-date"
                value={headTaskForm.deadline}
                onChange={(e) => setHeadTaskForm((p) => ({ ...p, deadline: e.target.value }))}
                style={{ marginTop: "6px" }}
              />
            </div>
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label className="adm-form-label" htmlFor="head-task-body">
              Task
            </label>
            <textarea
              id="head-task-body"
              className="adm-textarea"
              value={headTaskForm.task}
              onChange={(e) => setHeadTaskForm((p) => ({ ...p, task: e.target.value }))}
              rows={3}
              placeholder="Describe what the head should do"
              style={{ marginTop: "6px" }}
            />
          </div>
          <div className="adm-actions">
            <button
              type="button"
              className="adm-btn-primary"
              onClick={handleCeoHeadTaskSubmit}
              disabled={headTasksLoading}
            >
              {editingHeadTask ? "Update head task" : "Assign to head"}
            </button>
            {editingHeadTask ? (
              <button type="button" className="adm-btn-ghost" onClick={cancelEditCeoHeadTask}>
                Cancel edit
              </button>
            ) : null}
            {headTasksLoading ? <span className="adm-muted-inline">Loading…</span> : null}
          </div>
          <div className="adm-head-assignments">
            <h4 className="adm-head-list-title">All head assignments</h4>
            <p className="adm-head-list-hint">
              One fetch lists every task; below they are{" "}
              <strong>partitioned</strong> so CEO vs HR is obvious. Summary:{" "}
              <strong style={{ color: "#3730a3" }}>CEO</strong>{" "}
              {partitionedHeadTasks.ceo.length} · <strong style={{ color: "#166534" }}>HR</strong>{" "}
              {partitionedHeadTasks.hr.length} ·{" "}
              <span style={{ color: "#475569" }}>Unlabeled</span> {partitionedHeadTasks.legacy.length}{" "}
              (total {headTasks.length})
            </p>
            <div className="adm-legend">
              <span className="adm-legend-pill" style={{ background: "#e0e7ff", color: "#312e81", border: "1px solid #a5b4fc" }}>
                Indigo = CEO
              </span>
              <span className="adm-legend-pill" style={{ background: "#dcfce7", color: "#14532d", border: "1px solid #86efac" }}>
                Green = HR
              </span>
              <span className="adm-legend-pill" style={{ background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1" }}>
                Slate = legacy
              </span>
            </div>
            {headTasks.length === 0 && !headTasksLoading ? (
              <p className="adm-empty">No head tasks yet.</p>
            ) : null}
            <div className="adm-head-scroll">
              {[
                {
                  key: "ceo",
                  title: "Assigned by CEO / Management",
                  tasks: partitionedHeadTasks.ceo,
                },
                {
                  key: "hr",
                  title: "Assigned by HR",
                  tasks: partitionedHeadTasks.hr,
                },
                {
                  key: "legacy",
                  title: "Earlier tasks (assigner not stored)",
                  tasks: partitionedHeadTasks.legacy,
                },
              ].map(({ key, title, tasks: sectionTasks }) => {
                if (sectionTasks.length === 0) return null;
                const theme = HEAD_TASK_PARTITION_STYLES[key];
                return (
                  <div
                    key={key}
                    className="adm-partition"
                    style={{
                      border: theme.sectionBorder,
                      background: theme.sectionBg,
                    }}
                  >
                    <div className="adm-partition-head" style={{ borderBottom: theme.sectionBorder }}>
                      <span className="adm-partition-accent" style={{ background: theme.accentBar }} />
                      <strong className="adm-partition-title" style={{ color: theme.sectionTitle }}>
                        {title}
                      </strong>
                      <span className="adm-partition-count">
                        {sectionTasks.length} task{sectionTasks.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="adm-partition-body">
                      {sectionTasks.map((task) => {
                        const head = headAdmins.find((a) => a._id === task.headId);
                        const src = formatHeadTaskAssignmentSource(task);
                        return (
                          <div
                            key={task._id}
                            className="adm-head-card"
                            style={{
                              border: theme.cardBorder,
                              background: theme.cardBg,
                              borderLeft: theme.cardLeft,
                            }}
                          >
                            <div className="adm-head-card-top">
                              <div className="adm-head-card-main">
                                <div className="adm-head-meta-row">
                                  <span
                                    className="adm-ribbon"
                                    style={{ background: theme.ribbonBg, color: theme.ribbonColor }}
                                  >
                                    {theme.ribbonLabel}
                                  </span>
                                  <span style={{ fontSize: "12px", fontWeight: 700, color: theme.sectionTitle, opacity: 0.9 }}>
                                    {src}
                                  </span>
                                </div>
                                <div className="adm-head-task-title">{task.title}</div>
                                <div className="adm-head-sub">
                                  Head: {head?.name || "Unknown"} ({head?.department || "—"})
                                </div>
                              </div>
                              <div className="adm-head-actions">
                                <button
                                  type="button"
                                  className="adm-btn-sm"
                                  onClick={() => handleEditCeoHeadTask(task)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="adm-btn-sm adm-btn-sm--danger"
                                  onClick={() => handleDeleteCeoHeadTask(task._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div className="adm-head-foot">
                              <div className="adm-kv">
                                <span>Priority</span>
                                <span>{task.priority || "—"}</span>
                              </div>
                              <div className="adm-kv">
                                <span>Status</span>
                                <span>{task.status || "pending"}</span>
                              </div>
                              <div className="adm-kv">
                                <span>Due</span>
                                <span>{task.deadline ? formatDueDate(task.deadline) : "—"}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="adm-main-split">
          <div className="adm-panel adm-panel--tasks">
            <h3 className="adm-panel-title">Tasks and subtasks</h3>
            <div className="adm-task-list-scroll">
              {loading ? <p className="adm-empty">Loading data…</p> : null}
              {!loading && (!projectData || totalTasks === 0) ? (
                <p className="adm-empty">No tasks found for this selection.</p>
              ) : null}
              {!loading &&
                projectData?.todos?.map((task) => {
                  const subtasks = Array.isArray(task.subTasks) ? task.subTasks : [];
                  const doneSubtasks = subtasks.filter(
                    (sub) => sub.status === "completed",
                  ).length;
                  const taskDueDate = task.duedate || task.dueDate;
                  const rowKey = `${task.sourceProjectId || selectedProjectId}-${task._id}-${task.task_id}`;
                  return (
                    <div key={rowKey} className="adm-task-card">
                      <div className="adm-task-card-head">
                        <strong className="adm-task-title">{task.title || "Task"}</strong>
                        <div className="adm-task-chips">
                          <span className="adm-chip adm-chip--status">{task.status || "pending"}</span>
                          <span className="adm-chip adm-chip--sub">
                            Subtasks {doneSubtasks}/{subtasks.length}
                          </span>
                          <span className="adm-chip adm-chip--due">Due {formatDueDate(taskDueDate)}</span>
                        </div>
                      </div>
                      {task.sourceProjectTitle ? (
                        <p className="adm-task-project">
                          Project: <strong>{task.sourceProjectTitle}</strong>
                        </p>
                      ) : null}
                      <p className="adm-task-assign">Assigned by: {task.headName || "Not assigned"}</p>

                      {subtasks.length > 0 ? (
                        <ul className="adm-sub-list">
                          {subtasks.map((sub) => {
                            const done = sub.status === "completed";
                            return (
                              <li
                                key={`${rowKey}-${sub.todo_id}`}
                                className={`adm-sub-item ${done ? "adm-sub-item--done" : ""}`}
                              >
                                <span className="adm-sub-dot" aria-hidden />
                                <span>{sub.title}</span>
                                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
                                  {sub.createdAt && (
                                    <span style={{ fontSize: "0.75rem", color: "var(--adm-muted2)", whiteSpace: "nowrap" }}>
                                      {formatDueDate(sub.createdAt)}
                                    </span>
                                  )}
                                  <span className="adm-sub-status" style={{ marginLeft: 0 }}>
                                    {sub.status || "pending"}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="adm-empty" style={{ marginTop: "12px" }}>
                          No subtasks available.
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          <aside className="adm-reports" aria-label="Employee reports">
            <h3 className="adm-reports-title">Selected employee reports</h3>
            {reportsLoading ? <p className="adm-empty">Loading reports…</p> : null}
            {!reportsLoading && employeeReports.length === 0 ? (
              <p className="adm-empty">No reports found for selected employee.</p>
            ) : null}
            {!reportsLoading &&
              employeeReports.map((report) => (
                <article key={report._id || report.id} className="adm-report-card">
                  <div className="adm-report-top">
                    <h4 className="adm-report-title">{report.title || "Work report"}</h4>
                    <div className="adm-report-date">{formatDueDate(report.date || report.createdAt)}</div>
                  </div>
                  <p className="adm-report-body">
                    {report.desc || report.content || "No report content available."}
                  </p>
                </article>
              ))}
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, accent }) {
  return (
    <div className={`adm-stat${accent ? " adm-stat--accent" : ""}`}>
      <div className="adm-stat-title">{title}</div>
      <div className="adm-stat-value">{value}</div>
    </div>
  );
}

export default Admin;
