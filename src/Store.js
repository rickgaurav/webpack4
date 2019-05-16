import {createStore} from 'redux';
import RootReducer from './RootReducer';

const store = createStore(RootReducer);

window.stores = () => store.getState();

export default store;