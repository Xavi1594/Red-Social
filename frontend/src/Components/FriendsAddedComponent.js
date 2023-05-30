import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

export const FriendsAddedComponent = () => {
  const [amigosAgregados, setAmigosAgregados] = useState([]);

  useEffect(() => {
    cargarAmigosAgregados();
  }, []);

  const cargarAmigosAgregados = () => {
    fetch('http://localhost:3000/amigos/agregados', { credentials: 'include' })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('No se pudo obtener la lista de amigos agregados');
      })
      .then((amigosAgregados) => {
        setAmigosAgregados(amigosAgregados);
      })
      .catch((error) => {
        console.error('Ha ocurrido un error:', error.message);
      });
  };

  const eliminarAmigo = (idAmigo) => {
    fetch(`http://localhost:3000/amigos/eliminar/${idAmigo}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('No se pudo eliminar al amigo');
      })
      .then((amigo) => {
        cargarAmigosAgregados();
        alert(`Amigo eliminado con éxito`);
      })
      .catch((error) => {
        console.error('Ha ocurrido un error:', error.message);
      });
  };

  return (
    <div className="container mt-5 amigosContainer">
      <div className="row mt-5">
        <div className="col-lg-12">
          <div className="agregados-section row">
            {amigosAgregados.map((amigo) => {
              return (
                <div
                  key={amigo.id}
                  className="usuario-card amigo-card col-sm-6 col-md-4 col-lg-3 mx-auto"
                >
                  <Link to={`/amigos/${amigo.id}`}>
                  <h2 className="nombre-usuario">
                    <strong>{amigo.fullname}</strong>
                  </h2>
                  </Link>
                  <img
                    src={amigo.user_img}
                    className="img-fluid rounded mt-3"
                    style={{ width: '100px', height: '100px' }}
                    alt="Foto de perfil"
                  />
                  <div className="detalles">
                    <p className="card-text">
                      <small className="text-muted h4">{amigo.country}</small>
                    </p>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminarAmigo(amigo.id)}
                    >
                      Eliminar amigo
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
