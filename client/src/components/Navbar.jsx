import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" onClick={closeMenu}>
          <i className="bi bi-images"></i> Alzikrayat
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`navbar-collapse collapse${open ? ' show' : ''}`}>
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            <NavLink className="nav-link" to="/photos" onClick={closeMenu}>Gallery</NavLink>
            <NavLink className="nav-link" to="/about" onClick={closeMenu}>About Us</NavLink>

            {user ? (
              <>
                <NavLink className="nav-link" to="/upload" onClick={closeMenu}>
                  <i className="bi bi-cloud-arrow-up"></i> Upload
                </NavLink>
                <span className="navbar-text user-greeting">Hi, {user.firstName}</span>
                <button className="btn btn-outline-light btn-sm nav-action" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </>
            ) : (
              <>
                <span className="navbar-text user-greeting">Please Login</span>
                <Link className="btn btn-warning btn-sm nav-action" to="/login" onClick={closeMenu}>
                  <i className="bi bi-box-arrow-in-right"></i> Login / Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
