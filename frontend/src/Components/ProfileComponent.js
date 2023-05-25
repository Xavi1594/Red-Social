import { body } from 'express-validator';
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
      navigate('/'); // Redirigir a la página de inicio si no se ha iniciado sesión
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
    fetch('http://localhost:3000/eliminarcuenta', {
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
    
    <div className="container my-5" style={{ backgroundColor: '#86888a' }}>
      {loggedIn ? (
        <>
          <div className="row justify-content-center">
            <div className="col-6 col-md-4">
              <img
                src="https://picsum.photos/200/300"
                className="img-fluid mt-3"
                width="200"
                alt="Foto de perfil"
              />
            </div>
          </div>

          <div className="card mt-5">
            <div className="card-body">
              <div className="row my-3 bg-light p-3">
                <div className="col-3 col-md-2 text-muted">Nombre completo:</div>
                <div className="col-9 col-md-10">
                  <p className="card-text shadow">{datosPerfil.fullname}</p>
                </div>
              </div>

              <div className="row my-3 bg-light p-3">
                <div className="col-3 col-md-2 text-muted">Ciudad de residencia:</div>
                <div className="col-9 col-md-10">
                  <p className="card-text shadow">{datosPerfil.city}</p>
                </div>
              </div>

              <div className="row my-3 bg-light p-3">
                <div className="col-3 col-md-2 text-muted">País de residencia:</div>
                <div className="col-9 col-md-10">
                  <p className="card-text shadow">{datosPerfil.country}</p>
                </div>
              </div>

              <div className="row my-3 bg-light p-3">
                <div className="col-3 col-md-2 text-muted">Edad:</div>
                <div className="col-9 col-md-10">
                  <p className="card-text shadow">{datosPerfil.age}</p>
                </div>
              </div>

              <div className="row my-3 bg-light p-3">
                <div className="col-3 col-md-2 text-muted">Estudios:</div>
                <div className="col-9 col-md-10">
                  <p className="card-text shadow">{datosPerfil.university}</p>
                </div>
              </div>

              <div className="row my-3 bg-light p-3">
                <div className="col-3 col-md-2 text-muted">Idiomas:</div>
                <div className="col-9 col-md-10">
                  <p className="card-text shadow">{datosPerfil.languages}</p>
                </div>
              </div>

              <div className="row my-3 bg-light p-3">
                <div className="col-3 col-md-2 text-muted">Perfil de Linkedin:</div>
                <div className="col-9 col-md-10">
                  <p className="card-text shadow">
                    <a href={datosPerfil.linkedin}>{datosPerfil.linkedin}</a>
                  </p>
                </div>
              </div>

              <div className="row my-3 bg-light p-3">
                <div className="col-3 col-md-2 text-muted">Hobbies:</div>
                <div className="col-9 col-md-10">
                  <p className="card-text shadow">{datosPerfil.hobbies}</p>
                </div>
              </div>

              <div className="row my-3 justify-content-center">
                <div className="col-6">
                  <button id="eliminar-cuenta" className="btn btn-danger btn-block" onClick={handleEliminarCuenta}>
                    Eliminar cuenta
                  </button>
                </div>
              </div>

              <div className="row my-3 oculto" id="mensaje-confirmacion">
                <div className="col-12">
                  {/* <div className="alert alert-success" role="alert">
                    La cuenta ha sido eliminada exitosamente.
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>No se ha iniciado sesión</p>
      )}
    </div>
  );
};
