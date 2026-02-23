import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { loadTasks, updateTaskStatus, removeTask } from '../redux/tasksSlice';
import { loadUsers } from '../redux/usersSlice';
import { selectAllTasks, selectTasksLoading } from '../redux/tasksSelectors';
import { selectAllUsers } from '../redux/usersSelectors';

const COLUMNS = [
    { id: 'todo', label: 'To Do', className: 'col-todo' },
    { id: 'in-progress', label: 'In Progress', className: 'col-in-progress' },
    { id: 'done', label: 'Done', className: 'col-done' },
];

const PRIORITY_LABELS = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };

const KanbanBoard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const allTasks = useSelector(selectAllTasks);
    const loading = useSelector(selectTasksLoading);
    const users = useSelector(selectAllUsers);

    const [filterUser, setFilterUser] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [toast, setToast] = useState(null);

    useEffect(() => {
        dispatch(loadTasks());
        dispatch(loadUsers());
    }, [dispatch]);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 2500);
    };

    const filteredTasks = allTasks.filter((t) => {
        if (filterUser && String(t.userId) !== filterUser) return false;
        if (filterPriority && t.priority !== filterPriority) return false;
        return true;
    });

    const getTasksByStatus = (status) => filteredTasks.filter((t) => t.status === status);

    const getUserById = (userId) => users.find((u) => String(u.id) === String(userId));

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId) return;
        dispatch(updateTaskStatus({ id: draggableId, status: destination.droppableId }));
        showToast(`Task moved to ${destination.droppableId.replace('-', ' ')} ✓`);
    };

    const handleDelete = (e, taskId) => {
        e.stopPropagation();
        e.preventDefault();
        if (window.confirm('Delete this task?')) {
            dispatch(removeTask(taskId));
            showToast('Task deleted', 'error');
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner" />
                <span>Loading board...</span>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Kanban Board</h1>
                    <p className="page-subtitle">{allTasks.length} tasks · Drag to move between columns</p>
                </div>
                <Link to="/tasks/new" className="btn btn-primary">+ New Task</Link>
            </div>

            {/* Stats */}
            <div className="stats-bar">
                {COLUMNS.map((col) => (
                    <div className="stat-chip" key={col.id}>
                        <span>{col.label}</span>
                        <strong>{getTasksByStatus(col.id).length}</strong>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <select
                    className="filter-select"
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                >
                    <option value="">👤 All Users</option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>{u.username}</option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                >
                    <option value="">🎯 All Priorities</option>
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                </select>

                {(filterUser || filterPriority) && (
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => { setFilterUser(''); setFilterPriority(''); }}
                    >
                        ✕ Clear
                    </button>
                )}
            </div>

            {/* Board */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="kanban-board">
                    {COLUMNS.map((col) => {
                        const tasks = getTasksByStatus(col.id);
                        return (
                            <div key={col.id} className={`kanban-column ${col.className}`}>
                                <div className="column-header">
                                    <div className="column-title-group">
                                        <span className="column-dot" />
                                        <span className="column-title">{col.label}</span>
                                    </div>
                                    <span className="column-count">{tasks.length}</span>
                                </div>

                                <Droppable droppableId={col.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            className={`column-tasks ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            {tasks.length === 0 && (
                                                <div className="empty-state">
                                                    <div className="empty-icon">📭</div>
                                                    <span>Drop tasks here</span>
                                                </div>
                                            )}
                                            {tasks.map((task, index) => {
                                                const user = getUserById(task.userId);
                                                return (
                                                    <Draggable
                                                        key={task.id}
                                                        draggableId={String(task.id)}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`task-card priority-${task.priority} ${snapshot.isDragging ? 'dragging' : ''}`}
                                                                onClick={() => navigate(`/task/${task.id}`)}
                                                            >
                                                                <div className="task-card-header">
                                                                    <span className="task-title">{task.title}</span>
                                                                    <div className="task-actions">
                                                                        <button
                                                                            className="task-action-btn"
                                                                            onClick={(e) => { e.stopPropagation(); navigate(`/task/${task.id}/edit`); }}
                                                                            title="Edit"
                                                                        >✏️</button>
                                                                        <button
                                                                            className="task-action-btn delete"
                                                                            onClick={(e) => handleDelete(e, task.id)}
                                                                            title="Delete"
                                                                        >🗑️</button>
                                                                    </div>
                                                                </div>

                                                                {task.description && (
                                                                    <p className="task-description">{task.description}</p>
                                                                )}

                                                                <div className="task-footer">
                                                                    <div className="task-meta">
                                                                        <span className={`badge badge-${task.priority}`}>
                                                                            {PRIORITY_LABELS[task.priority]}
                                                                        </span>
                                                                    </div>
                                                                    {user && (
                                                                        <img
                                                                            src={user.avatar}
                                                                            alt={user.username}
                                                                            className="avatar"
                                                                            title={user.username}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>

            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.msg}
                </div>
            )}
        </div>
    );
};

export default KanbanBoard;