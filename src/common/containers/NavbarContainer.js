import {connect} from 'react-redux';

import Navbar from '../components/Navbar';
import {setActiveTabAction} from '../ducks/NavbarDuck';

const mapDispatchToProps = (dispatch) => {
	return {
		setActiveTab: (active_tab) => dispatch(setActiveTabAction(dispatch, active_tab))
	};
}

export default connect(
	null,
	mapDispatchToProps
)(Navbar);