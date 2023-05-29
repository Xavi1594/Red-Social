import React, { useEffect, useState } from 'react';
import Pagination from './Pagination';

export const FriendsComponent = () => {
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = usuariosRegistrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(usuariosRegistrados.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="container mt-5">
        <h3 className="mt-5 text-center">Añade amigos</h3>
        <div className="registrados-section row">
          {currentItems.map((usuario) => (
            <div
              key={usuario.id}
              className="usuario-card col-sm-6 col-md-4 col-lg-3 mx-auto"
            >
              <h2 className="nombre-usuario">
                <strong>{usuario.username}</strong>
              </h2>
              <img
                src={usuario.user_img}
                className="img-fluid rounded mt-3"
                style={{ width: '100px', height: '100px' }}
                alt="Foto de perfil"
              />
              <div className="detalles">
                <p className="card-title">{usuario.fullname}</p>
                {!usuario.amigo ? (
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      agregarAmigo(usuario.id, usuario.username);
                    }}
                  >
                    Agregar amigo
                  </button>
                ) : (
                  <button
                    className="btn btn-danger"
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
        />
      </div>
    </div>
  );
};
