import {combineReducers} from 'redux';
import TrainsDuck from './trains/ducks/TrainsDuck';
import BusesDuck from './buses/ducks/BusesDuck';
import FlightsDuck from './flights/ducks/FlightsDuck';
import NavbarDuck from './common/ducks/NavbarDuck';

export default combineReducers({
	trains: TrainsDuck,
	buses: BusesDuck,
	flights: FlightsDuck,
	navbar: NavbarDuck
});