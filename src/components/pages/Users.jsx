import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUsers, addUser, removeUser } from '../redux/usersSlice';
import { loadTasks } from '../redux/tasksSlice';
import { selectAllUsers, selectUsersLoading } from '../redux/usersSelectors';
import { selectTasksByUser } from '../redux/tasksSelectors';

const UserCard = ({ user, onDelete }) => {
    const tasks = useSelector(selectTasksByUser(user.id));
    return (
        <div className="user-card fade-in">
            <img src={user.avatar} alt={user.username} className="avatar avatar-xl" />
            <div>
                <div className="user-name">@{user.username}</div>
                <div className="user-tasks-count">
                    {tasks.length > 0
                        ? `${tasks.length} task${tasks.length > 1 ? 's' : ''} assigned`
                        : 'No tasks assigned'}
                </div>
            </div>
            {tasks.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
                    {tasks.slice(0, 3).map((t) => (
                        <span key={t.id} className={`badge badge-${t.priority}`} style={{ fontSize: '0.68rem' }}>
                            {t.title.length > 14 ? t.title.slice(0, 14) + '…' : t.title}
                        </span>
                    ))}
                    {tasks.length > 3 && (
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                            +{tasks.length - 3} more
                        </span>
                    )}
                </div>
            )}
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(user.id, tasks.length)}>
                🗑️ Remove
            </button>
        </div>
    );
};

const Users = () => {
    const dispatch = useDispatch();
    const users = useSelector(selectAllUsers);
    const loading = useSelector(selectUsersLoading);

    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        dispatch(loadUsers());
        dispatch(loadTasks());
    }, [dispatch]);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 2500);
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;
        setSubmitting(true);
        const newUser = {
            username: username.trim().toLowerCase(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=8b5cf6&color=fff&bold=true`,
        };
        await dispatch(addUser(newUser));
        setUsername('');
        setShowModal(false);
        setSubmitting(false);
        showToast(`User @${newUser.username} added ✓`);
    };

    const handleDelete = (userId, taskCount) => {
        if (taskCount > 0) {
            alert(
                `⚠️ Impossible de supprimer cet utilisateur car ${taskCount} tâche(s) lui sont assignées.\n\nVeuillez réassigner ou supprimer les tâches d'abord.`
            );
            return;
        }

        if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
            dispatch(removeUser(userId));
            showToast('Utilisateur supprimé', 'error');
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner" />
                <span>Loading users...</span>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Team Members</h1>
                    <p className="page-subtitle">{users.length} members · Manage your team</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    + Add Member
                </button>
            </div>

            {users.length === 0 ? (
                <div className="empty-state" style={{ marginTop: '4rem' }}>
                    <div className="empty-icon">👥</div>
                    <p>No team members yet</p>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        Add First Member
                    </button>
                </div>
            ) : (
                <div className="users-grid">
                    {users.map((user) => (
                        <UserCard key={user.id} user={user} onDelete={handleDelete} />
                    ))}
                </div>
            )}

            {/* Add User Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">Add Team Member</span>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleAddUser}>
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. john_doe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            {username && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', marginBottom: '1rem' }}>
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=8b5cf6&color=fff&bold=true`}
                                        alt="preview"
                                        className="avatar"
                                    />
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>@{username.toLowerCase()}</span>
                                </div>
                            )}
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? '⏳ Adding...' : '✅ Add Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.msg}
                </div>
            )}
        </div>
    );
};

export default Users;
