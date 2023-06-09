import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginFormComponent = ({ onLogin }) => { 
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/", {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameOrEmail, password }),
      });
      
      const data = await response.json();

      if (response.status !== 200) {
        setErrorMessage(data.error || 'Ha ocurrido un error, por favor intente nuevamente.');
        return;
      }

      localStorage.setItem('token', data.token);

      onLogin();

      navigate('/posts');
    } catch (error) {
      setErrorMessage('Ha ocurrido un error, por favor intente nuevamente.');
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="card col-md-4 col-lg-6 col-10 p-0 d-flex flex-column justify-content-center align-items-center mx-auto" id='container-inputs'>
        <div className="text-center mt-5">
          <h2 className="card-header text-center h2-animation">Inicia sesión en Socialy</h2>
          <img src="socialy.jpg" className="img-thumbnail mt-5" width="200" alt="..." />
        </div>
        <div className="col-md-6 mx-auto mt-5">
          <form>
            <div className="mb-2">
              <label htmlFor="email" className="form-label">Nombre de usuario o email:</label>
              <input
                id="nombre-de-usuario-o-correo"
                type="text"
                className="form-control input-slide"
                placeholder="Introduce tu nombre de usuario o email"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="password" className="form-label">Contraseña:</label>
              <input
                type="password"
                className="form-control input-slide"
                placeholder="Introduce tu contraseña"
                required
                id="contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="btn btn-primary w-100 mt-3 button-animation"
                type="button"
                onClick={handleLogin}
              >
                Iniciar Sesión
              </button>
            </div>
            {errorMessage && <div id="mensaje-de-error" className="error">{errorMessage}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};
