import {connect} from 'react-redux';

import NavbarItem from '../components/NavbarItem';
import {setActiveTabAction} from '../ducks/NavbarDuck';

const mapStateToProps = (state, ownProps) => {
	return {
		is_active: ownProps.text === state.navbar.active_tab,
		...ownProps
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		setActiveTab: (active_tab) => dispatch(setActiveTabAction(dispatch, active_tab))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NavbarItem);