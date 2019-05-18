import { connect } from 'react-redux';
import RouteFinder from "../components/RouteFinder";
import {initStationsData} from "../ducks/RouteFinderDuck";


const mapStateToProps = state => {
  debugger
  return {
    loading: state.routeFinder.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setupData: () => dispatch(initStationsData())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteFinder);