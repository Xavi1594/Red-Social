import React, { useEffect, useState } from 'react';
import Pagination from './Pagination';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

export const FriendsComponent = () => {
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    cargarUsuariosRegistrados();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [usuariosRegistrados, searchTerm]);

  const cargarUsuariosRegistrados = () => {
    fetch('http://localhost:3000/usuarios/registrados', {
      credentials: 'include',
    })
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

  const filterUsers = () => {
    const filteredItems = usuariosRegistrados.filter((usuario) =>
      usuario.fullname.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredItems);
  };

  const agregarAmigo = (idAmigo, nombreAmigo) => {
    fetch(`http://localhost:3000/amigos/agregar/${idAmigo}`, {
      method: 'POST',
      credentials: 'include',
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
      credentials: 'include',
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

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  useEffect(() => {
    filterUsers();
}, [usuariosRegistrados, searchTerm]); 

const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
};

  return (
    <div className="container mt-5 amigosContainer">
      <SearchBar
        onSearch={handleSearch}
        usuariosRegistrados={usuariosRegistrados}
        setUsuariosRegistrados={setUsuariosRegistrados}
      />
      <div className="row mt-5">
        <div className="col-lg-12">
          <div className="registrados-section row">
            {currentItems.map((usuario) => (
              <div
                key={usuario.id}
                className="usuario-card amigo-card col-sm-6 col-md-4 col-lg-3 mx-auto"
              >
                <Link to={`/amigos/${usuario.id}`}>
                  <h2 className="nombre-usuario">
                    <strong>{usuario.fullname}</strong>
                  </h2>
                </Link>
                <img
                  src={usuario.user_img}
                  className="img-fluid rounded mt-3"
                  style={{ width: '100px', height: '100px' }}
                  alt="Foto de perfil"
                />
                <div className="detalles">
                  <p className="card-text">
                    <small className="text-muted h4">{usuario.country}</small>
                  </p>
                  {usuario.amigo === 1 ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        eliminarAmigo(usuario.id, usuario.username);
                      }}
                    >
                      Eliminar amigo
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        agregarAmigo(usuario.id, usuario.username);
                      }}
                    >
                      Agregar amigo
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="row justify-content-center mb-5 py-5">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
