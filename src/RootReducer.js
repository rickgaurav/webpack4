import {combineReducers} from 'redux';
import RouteFinderDuck from "./routeFinder/ducks/RouteFinderDuck";

export default combineReducers({
	routeFinder: RouteFinderDuck
});