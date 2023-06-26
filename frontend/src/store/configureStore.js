import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import friendsReducer from './reducers/friendsReducer';

const rootReducer = combineReducers({
  friends: friendsReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
