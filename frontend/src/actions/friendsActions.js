export const LOAD_FRIENDS = 'LOAD_FRIENDS';
export const DELETE_FRIEND = 'DELETE_FRIEND';

export const loadFriends = () => {
  return (dispatch) => {
    fetch('http://localhost:3000/amigos/agregados', { credentials: 'include' })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('No se pudo obtener la lista de amigos agregados');
      })
      .then((amigosAgregados) => {
        dispatch({
          type: LOAD_FRIENDS,
          payload: amigosAgregados,
        });
      })
      .catch((error) => {
        console.error('Ha ocurrido un error:', error.message);
      });
  };
};

export const deleteFriend = (idAmigo) => {
  return (dispatch) => {
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
        dispatch({
          type: DELETE_FRIEND,
          payload: idAmigo,
        });
      })
      .catch((error) => {
        console.error('Ha ocurrido un error:', error.message);
      });
  };
};
