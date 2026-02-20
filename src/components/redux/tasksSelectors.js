export const selectAllTasks = (state) => state.tasks.items;

export const selectTasksByStatus = (status) => (state) =>
    state.tasks.items.filter((t) => t.status === status);

export const selectTaskById = (id) => (state) =>
    state.tasks.items.find((t) => String(t.id) === String(id)) || state.tasks.currentTask;

export const selectTasksByUser = (userId) => (state) =>
    state.tasks.items.filter((t) => String(t.userId) === String(userId));

export const selectTasksByPriority = (priority) => (state) =>
    state.tasks.items.filter((t) => t.priority === priority);

export const selectTasksLoading = (state) => state.tasks.loading;

export const selectTasksError = (state) => state.tasks.error;

export const selectCurrentTask = (state) => state.tasks.currentTask;