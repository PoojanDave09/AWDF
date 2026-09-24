import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = '/api/tasks';

// Helper: add auth header to every request
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
});

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium' });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle 401 → redirect to login
  const handle401 = (res) => {
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/auth');
      return true;
    }
    return false;
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { headers: authHeaders() });
      if (handle401(res)) return;
      const json = await res.json();
      setTasks(json.data || []);
    } catch (e) {
      setError('Failed to load tasks. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth'); return; }
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ title: '', description: '', priority: 'Medium' });
    setEditingId(null);
  };

  const submitTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setError('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      if (handle401(res)) return;
      if (!res.ok) {
        const json = await res.json();
        setError(json.message || 'Failed to save task');
        return;
      }
      const json = await res.json();
      if (editingId) {
        setTasks(prev => prev.map(t => t._id === editingId ? json.data : t));
      } else {
        setTasks(prev => [...prev, json.data]);
      }
      resetForm();
    } catch (err) {
      setError('Network error');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (handle401(res)) return;
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (e) {
      setError('Failed to delete task');
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ completed: !completed }),
      });
      if (handle401(res)) return;
      const json = await res.json();
      setTasks(prev => prev.map(t => t._id === id ? json.data : t));
    } catch (e) {
      setError('Failed to update task');
    }
  };

  const editTask = (task) => {
    setForm({ title: task.title, description: task.description || '', priority: task.priority || 'Medium' });
    setEditingId(task._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={styles.label}>FULL-STACK WORKSPACE</p>
            <h2 style={styles.title}>Task Manager</h2>
          </div>
          <span style={styles.badge}>{filtered.length} tasks</span>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {/* Add / Edit Form */}
        <form onSubmit={submitTask} style={styles.addRow}>
          <input
            name="title"
            placeholder="What needs doing?"
            value={form.title}
            onChange={handleChange}
            required
            style={styles.addInput}
          />
          <button type="submit" style={styles.addBtn}>
            {editingId ? 'Update' : 'Add task'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={{ ...styles.addBtn, background: '#aaa' }}>
              Cancel
            </button>
          )}
        </form>

        {/* Description + Priority (collapsible only when editing) */}
        {editingId && (
          <div style={styles.extraFields}>
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              style={styles.textarea}
            />
            <select name="priority" value={form.priority} onChange={handleChange} style={styles.select}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        )}

        {/* Filters */}
        <div style={styles.filters}>
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '24px' }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa', padding: '24px' }}>No tasks found.</p>
        ) : (
          <ul style={styles.list}>
            {filtered.map(task => (
              <li key={task._id} style={styles.item}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task._id, task.completed)}
                  style={styles.checkbox}
                />
                <div style={styles.itemBody}>
                  <span style={{ ...styles.taskTitle, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#aaa' : '#111' }}>
                    {task.title}
                  </span>
                  <span style={styles.date}>
                    {new Date(task.createdAt).toLocaleString()}
                  </span>
                </div>
                <div style={styles.actions}>
                  <button onClick={() => editTask(task)} style={styles.editBtn}>Edit</button>
                  <button onClick={() => deleteTask(task._id)} style={styles.deleteBtn}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    padding: '32px 16px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '28px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  label: { fontSize: '11px', fontWeight: '700', color: '#3b5bdb', letterSpacing: '1px', margin: '0 0 4px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#111', margin: 0 },
  badge: {
    background: '#f1f3f5',
    borderRadius: '20px',
    padding: '4px 12px',
    fontSize: '13px',
    color: '#555',
    fontWeight: '600',
  },
  error: {
    background: '#fff0f0',
    color: '#c0392b',
    borderRadius: '8px',
    padding: '10px 14px',
    marginBottom: '12px',
    fontSize: '13px',
    border: '1px solid #f5c6cb',
  },
  addRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '14px',
  },
  addInput: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
    fontSize: '14px',
    outline: 'none',
    background: '#f8f9fa',
  },
  addBtn: {
    padding: '10px 18px',
    background: '#3b5bdb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  },
  extraFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '14px',
  },
  textarea: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
    fontSize: '14px',
    resize: 'vertical',
    minHeight: '70px',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
    fontSize: '14px',
  },
  filters: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  filterBtn: {
    padding: '6px 16px',
    borderRadius: '20px',
    border: '1px solid #dee2e6',
    background: '#f8f9fa',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#666',
  },
  filterActive: {
    background: '#3b5bdb',
    color: '#fff',
    border: '1px solid #3b5bdb',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 8px',
    borderBottom: '1px solid #f0f0f0',
  },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer', flexShrink: 0 },
  itemBody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  taskTitle: { fontSize: '15px', fontWeight: '500' },
  date: { fontSize: '12px', color: '#aaa' },
  actions: { display: 'flex', gap: '6px', flexShrink: 0 },
  editBtn: {
    padding: '5px 12px',
    background: '#f1f3f5',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#333',
  },
  deleteBtn: {
    padding: '5px 12px',
    background: '#fa5252',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#fff',
    fontWeight: '600',
  },
};

export default TaskManager;
