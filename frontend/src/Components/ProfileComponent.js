import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfileComponent = ({ loggedIn }) => {
  const navigate = useNavigate();
  const [datosPerfil, setDatosPerfil] = useState({
    fullname: '',
    city: '',
    country: '',
    age: '',
    university: '',
    languages: '',
    linkedin: '',
    hobbies: '',
  });

  useEffect(() => {
    if (!loggedIn) {
      navigate('/perfil'); // Redireccionar a la página de inicio si no se ha iniciado sesión
      return;
    }

    fetch('http://localhost:3000/perfil', { credentials: 'include' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setDatosPerfil(data);
      })
      .catch((error) => {
        console.error('Error al recuperar los datos del perfil:', error);
      });
  }, [loggedIn, navigate]);

  const handleEliminarCuenta = () => {
    fetch('http://localhost:3000/eliminar-cuenta', {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        console.log(text);
        // Redireccionar a la página de inicio después de eliminar la cuenta
        navigate('/perfil');
      })
      .catch((error) => {
        console.error('Error al eliminar la cuenta:', error);
      });
  };

  return (
    <div className="container my-5">
      {loggedIn ? (
        <>
          <div className="row justify-content-center">
            <div className="col-6 col-md-4">
              <img
                src="./img/2021031202544061e0e3f25c3041f849de6b510817fb34.jpg"
                className="img-fluid rounded-circle mt-3"
                width="200"
                alt="Foto de perfil"
              />
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">Nombre completo:</div>
            <div className="col-9 col-md-10">
              <p>{datosPerfil.fullname}</p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">Ciudad de residencia:</div>
            <div className="col-9 col-md-10">
              <p>{datosPerfil.city}</p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">País de residencia:</div>
            <div className="col-9 col-md-10">
              <p>{datosPerfil.country}</p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">Edad:</div>
            <div className="col-9 col-md-10">
              <p>{datosPerfil.age}</p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">Estudios:</div>
            <div className="col-9 col-md-10">
              <p>{datosPerfil.university}</p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">Idiomas:</div>
            <div className="col-9 col-md-10">
              <p>{datosPerfil.languages}</p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">Perfil de Linkedin:</div>
            <div className="col-9 col-md-10">
              <p>
                <a href={datosPerfil.linkedin}>{datosPerfil.linkedin}</a>
              </p>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-3 col-md-2 text-muted">Hobbies:</div>
            <div className="col-9 col-md-10">
              <p>{datosPerfil.hobbies}</p>
            </div>
          </div>

          <button id="eliminar-cuenta" onClick={handleEliminarCuenta}>
            Eliminar cuenta
          </button>
          <p id="mensaje-confirmacion" className="oculto">
            La cuenta ha sido eliminada exitosamente.
          </p>
        </>
      ) : (
        <p>No se ha iniciado sesión</p>
      )}
    </div>
  );
};
