import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { NavLink, useNavigate } from 'react-router-dom';

export const NavbarComponent = ({ onLogout }) => {
  const [isNavbarOpen, setNavbarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Realiza una solicitud al backend para verificar si el usuario es administrador
    fetch('http://localhost:3000/usuarios/isadmin', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => setIsAdmin(data.isAdmin))
      .catch((error) => console.error('Error al verificar si el usuario es administrador:', error));
  }, []);

  const toggleNavbar = () => {
    setNavbarOpen(!isNavbarOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <NavLink to="/posts" className="navbar-brand">
            <img src="socialy.jpg" alt="Logo" style={{ width: '30px', marginRight: '5px' }} />
            Socialy
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`}
          >
            <form className="d-flex my-2 my-lg-0 ms-auto">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Buscar"
                aria-label="Buscar"
              />
              <button className="btn btn-outline-success" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </form>
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/posts" className="nav-link" aria-current="page">
                  Posts
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/perfil" className="nav-link">
                  Hoja de vida
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/amigos" className="nav-link ">
                  Amplía tu red
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/amigosagregados" className="nav-link">
                  Mis amigos
                </NavLink>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <NavLink to="/usuarios" className="nav-link">
                    Usuarios Registrados
                  </NavLink>
                </li>
              )}
              <li className="nav-item">
                <NavLink to="/registro" className="nav-link">
                  Registro
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={"/"} className="nav-link" onClick={handleLogout}>
                  Logout
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
