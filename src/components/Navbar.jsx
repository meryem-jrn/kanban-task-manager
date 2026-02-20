import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const { mode } = useSelector((state) => state.theme);

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <div className="navbar-logo">🌸</div>
                <span className="navbar-title">Gestion de Tâches</span>
            </Link>

            <ul className="navbar-nav">
                <li>
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                        🗂️ Board
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
                        👥 Users
                    </NavLink>
                </li>
            </ul>

            <div className="navbar-actions">
                <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => dispatch(toggleTheme())}
                    title="Toggle Theme"
                >
                    {mode === 'light' ? '🌙' : '☀️'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;