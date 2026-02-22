import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { loadTaskById, modifyTask } from '../redux/tasksSlice';
import { loadUsers } from '../redux/usersSlice';
import { selectTaskById } from '../redux/tasksSelectors';
import { selectAllUsers } from '../redux/usersSelectors';

const EditTask = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const task = useSelector(selectTaskById(id));
    const users = useSelector(selectAllUsers);

    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        userId: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        dispatch(loadTaskById(id));
        dispatch(loadUsers());
    }, [dispatch, id]);

    useEffect(() => {
        if (task) {
            setForm({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'medium',
                status: task.status || 'todo',
                userId: task.userId ? String(task.userId) : '',
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        setSubmitting(true);
        await dispatch(modifyTask({
            id,
            ...form,
            userId: form.userId || null,
        }));
        navigate(`/task/${id}`);
    };

    if (!task) {
        return (
            <div className="loading-state">
                <div className="spinner" />
                <span>Loading task...</span>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Edit Task</h1>
                    <p className="page-subtitle">Update task details and reassign if needed</p>
                </div>
                <Link to={`/task/${id}`} className="btn btn-ghost btn-sm">← Back to Details</Link>
            </div>

            <div className="form-container">
                <div className="form-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="Task title..."
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                className="form-control"
                                placeholder="Task description..."
                                value={form.description}
                                onChange={handleChange}
                                rows={4}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Priority</label>
                                <select
                                    name="priority"
                                    className="form-control"
                                    value={form.priority}
                                    onChange={handleChange}
                                >
                                    <option value="high">🔴 High</option>
                                    <option value="medium">🟡 Medium</option>
                                    <option value="low">🟢 Low</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select
                                    name="status"
                                    className="form-control"
                                    value={form.status}
                                    onChange={handleChange}
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Assign To</label>
                            <select
                                name="userId"
                                className="form-control"
                                value={form.userId}
                                onChange={handleChange}
                            >
                                <option value="">— Unassigned —</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.username}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-actions">
                            <Link to={`/task/${id}`} className="btn btn-secondary">Cancel</Link>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? '⏳ Saving...' : '💾 Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTask;
