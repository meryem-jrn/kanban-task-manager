import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { loadTaskById, removeTask } from '../redux/tasksSlice';
import { loadUsers } from '../redux/usersSlice';
import { selectTaskById } from '../redux/tasksSelectors';
import { selectUserById } from '../redux/usersSelectors';

const STATUS_LABELS = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done',
};

const PRIORITY_ICONS = { high: '🔴', medium: '🟡', low: '🟢' };

const TaskDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const task = useSelector(selectTaskById(id));
    const user = useSelector(selectUserById(task?.userId));

    useEffect(() => {
        dispatch(loadTaskById(id));
        dispatch(loadUsers());
    }, [dispatch, id]);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            dispatch(removeTask(id));
            navigate('/');
        }
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
                    <h1 className="page-title">Task Details</h1>
                    <p className="page-subtitle">View and manage task information</p>
                </div>
                <Link to="/" className="btn btn-ghost btn-sm">← Back to Board</Link>
            </div>

            <div className="task-details-card">
                <div className="task-details-header">
                    <h2 className="task-details-title">{task.title}</h2>
                    <div className="task-details-meta">
                        <span className={`badge badge-${task.priority}`}>
                            {PRIORITY_ICONS[task.priority]} {task.priority}
                        </span>
                        <span className={`badge badge-${task.status}`}>
                            {STATUS_LABELS[task.status] || task.status}
                        </span>
                    </div>
                </div>

                <div className="task-details-body">
                    <div className="detail-row">
                        <span className="detail-label">Description</span>
                        <span className="detail-value">{task.description || 'No description provided.'}</span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Status</span>
                        <span className="detail-value">
                            <span className={`badge badge-${task.status}`}>
                                {STATUS_LABELS[task.status] || task.status}
                            </span>
                        </span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Priority</span>
                        <span className="detail-value">
                            <span className={`badge badge-${task.priority}`}>
                                {PRIORITY_ICONS[task.priority]} {task.priority}
                            </span>
                        </span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Assigned To</span>
                        <div className="detail-value">
                            {user ? (
                                <div className="detail-user">
                                    <img src={user.avatar} alt={user.username} className="avatar" />
                                    <span>{user.username}</span>
                                </div>
                            ) : (
                                <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
                            )}
                        </div>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Task ID</span>
                        <span className="detail-value" style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            #{task.id}
                        </span>
                    </div>
                </div>

                <div className="form-actions" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <button className="btn btn-danger" onClick={handleDelete}>
                        🗑️ Delete Task
                    </button>
                    <Link to={`/task/${task.id}/edit`} className="btn btn-primary">
                        ✏️ Edit Task
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
