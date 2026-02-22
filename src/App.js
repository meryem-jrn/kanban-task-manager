import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import KanbanBoard from './pages/KanbanBoard';
import NewTask from './pages/NewTask';
import TaskDetails from './pages/TaskDetails';
import EditTask from './pages/EditTask';
import Users from './pages/Users';
import { loadUsers } from './store/usersSlice';

function App() {
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<KanbanBoard />} />
            <Route path="/tasks/new" element={<NewTask />} />
            <Route path="/task/:id" element={<TaskDetails />} />
            <Route path="/task/:id/edit" element={<EditTask />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
