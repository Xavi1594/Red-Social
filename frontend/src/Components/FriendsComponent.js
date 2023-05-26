import React, { useEffect, useState } from 'react';

export const FriendsComponent = () => {
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([]);

  useEffect(() => {
    cargarUsuariosRegistrados();
  }, []);

  const cargarUsuariosRegistrados = () => {
    fetch('http://localhost:3000/usuarios/registrados', { credentials: 'include' })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('No se pudo obtener la lista de usuarios registrados');
      })
      .then((usuariosRegistrados) => {
        setUsuariosRegistrados(usuariosRegistrados);
      })
      .catch((error) => {
        console.error('Ha ocurrido un error:', error.message);
      });
  };

  const agregarAmigo = (idAmigo, nombreAmigo) => {
    fetch(`http://localhost:3000/amigos/agregar/${idAmigo}`, {
      method: 'POST',
      credentials: 'include'
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('No se pudo agregar al amigo');
      })
      .then((amigo) => {
        cargarUsuariosRegistrados();
        alert(`Amigo ${nombreAmigo} agregado con éxito`);
      })
      .catch((error) => {
        console.error('Ha ocurrido un error:', error.message);
      });
  };

  const eliminarAmigo = (idAmigo, nombreAmigo) => {
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
        cargarUsuariosRegistrados();
        alert(`Amigo ${nombreAmigo} eliminado con éxito`);
      })
      .catch((error) => {
        console.error('Ha ocurrido un error:', error.message);
      });
  };

  return (
    <div>
      <div className="container mt-5">
        <h3 >Usuarios Registrados</h3>
        <div className="registrados-section row">
          {usuariosRegistrados.map((usuario) => (
            <div
              key={usuario.id}
              className="usuario-card col-sm-6 col-md-4 col-lg-3 mx-auto"
            >
              <h2 className="nombre-usuario ">
                <strong>{usuario.username}</strong>
              </h2>
              <div className="detalles">
                <p className="nombre-completo">{usuario.fullname}</p>
                <p className="edad">{usuario.age} años</p>
                <p className="pais">{usuario.country}</p>
                {!usuario.amigo ? (
                  <button
                    className="btn"
                    onClick={() => {
                      agregarAmigo(usuario.id, usuario.username);
                    }}
                  >
                    Agregar amigo
                  </button>
                ) : (
                  <button
                    className="btn"
                    onClick={() => {
                      eliminarAmigo(usuario.id, usuario.username);
                    }}
                  >
                    Eliminar amigo
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
