// friendsReducer.js
import { LOAD_FRIENDS, DELETE_FRIEND } from '../actions/friendsActions';

const initialState = {
  friends: [] // o cualquier otro valor predeterminado
};

const friendsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_FRIENDS:
      return {
        ...state,
        friends: action.payload
      };
    case DELETE_FRIEND:
      return {
        ...state,
        friends: state.friends.filter((amigo) => amigo.id !== action.payload)
      };
    default:
      return state;
  }
};

export default friendsReducer;