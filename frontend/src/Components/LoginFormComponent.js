import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginFormComponent = ({ onLogin }) => { // Asegúrate de pasar onLogin como prop
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameOrEmail, password }),
        credentials: 'include',
      });
      
      const data = await response.json();

      if (response.status !== 200) {
        setErrorMessage(data.error || 'Ha ocurrido un error, por favor intente nuevamente.');
        return;
      }

      // Guardar el token en el almacenamiento local
      localStorage.setItem('token', data.token);

      // Llama a la función pasada a través de las props para establecer que el usuario ha iniciado sesión
      onLogin(); 

      navigate('/perfil');
    } catch (error) {
      setErrorMessage('Ha ocurrido un error, por favor intente nuevamente.');
    }
  };
  return (
    <div className="container mt-4">
      <div className="row bt-5">
        <div className="text-center">
          <img src="./img/socialy.jpg" className="img-thumbnail mt-5" width="200" alt="..." />
        </div>
        <div className="col-md-6 mx-auto mt-5">
          <form>
            <div className="mb-2">
              <label htmlFor="email" className="form-label">Introduce tu nombre de usuario o email:</label>
              <input
                id="nombre-de-usuario-o-correo"
                type="text"
                className="form-control"
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
                className="form-control"
                placeholder="Introduce tu contraseña"
                required
                id="contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="btn btn-primary w-100 mt-3"
                type="button"
                onClick={handleLogin}
              >
                Iniciar Sesión
              </button>
            </div>
            <div id="mensaje-de-error" className="error">{errorMessage}</div>
          </form>
        </div>
      </div>
    </div>
  );
};
