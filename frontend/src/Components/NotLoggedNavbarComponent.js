import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { NavLink, useNavigate } from 'react-router-dom';

export const NotLoggedNavbarComponent = ({ onLogout }) => {
  const [isNavbarOpen, setNavbarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setNavbarOpen(!isNavbarOpen);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
        <NavLink to="/" className="navbar-brand">
            <img src="socialy.jpg" alt="Logo" style={{ width: '30px', marginRight: '15px' }} />
            Socialy
            </NavLink>
          <i className="bi bi-wechat"></i>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse justify-content-end ${isNavbarOpen ? 'show' : ''}`}>
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink to="/registro" className="nav-link">
                  Registro
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Login
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
