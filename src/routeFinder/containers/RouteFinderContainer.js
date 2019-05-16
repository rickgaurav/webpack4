import {connect} from 'react-redux';
import RouteFinder from "../components/RouteFinder";
import {initStationsData} from "../ducks/RouteFinderDuck";

const mapDispatchToProps = dispatch => {
  return {
    setupData: () => dispatch(initStationsData())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(RouteFinder);