import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadFriends, deleteFriend } from '../actions/friendsActions';

const FriendsAddedComponent = ({ friends, loadFriends, deleteFriend }) => {
  console.log(friends); 
  useEffect(() => {
    loadFriends();
  }, []);

  const eliminarAmigo = (idAmigo) => {
    deleteFriend(idAmigo);
    alert('Amigo eliminado con éxito');
  };

  if (!friends || friends.length === 0) {
    return <div>Loading...</div>; // o algún otro indicador de carga
  }

  return (
    <div className="container mt-5 amigosContainer">
      <div className="row mt-5">
        <div className="col-lg-12">
          <div className="agregados-section row">
            {friends.map((amigo) => {
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

const mapStateToProps = (state) => ({
  friends: state.friends // Asegúrate de que el nombre del estado sea correcto
});

const mapDispatchToProps = (dispatch) => ({
  loadFriends: () => dispatch(loadFriends()),
  deleteFriend: (id) => dispatch(deleteFriend(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FriendsAddedComponent);
