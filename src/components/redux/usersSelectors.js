export const selectAllUsers = (state) => state.users.items;

export const selectUserById = (userId) => (state) =>
    state.users.items.find((u) => String(u.id) === String(userId));

export const selectUsersLoading = (state) => state.users.loading;

export const selectUsersError = (state) => state.users.error;