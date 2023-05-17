import React, { useState } from 'react';

 export const LoginFormComponent = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const response = this.responseText;
        if (response.startsWith("Usuario o contraseña incorrectos")) {
          setErrorMessage(response);
        } else {
          window.location.href = "/dashboard.html";
        }
      }
    };
    xhr.open("POST", "/login", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(`username=${usernameOrEmail}&password=${password}`);
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


