import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import KanbanBoard from './components/pages/KanbanBoard';
import NewTask from './components/pages/NewTask';
import TaskDetails from './components/pages/TaskDetails';
import EditTask from './components/pages/EditTask';
import Users from './components/pages/Users';
import { loadUsers } from './components/redux/usersSlice';

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
