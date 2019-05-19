import { connect } from 'react-redux';
import RouteFinder from "../components/RouteFinder";
import {initStationsData} from "../ducks/RouteFinderDuck";


const mapStateToProps = state => {

  return {
    loading: state.routeFinder.loading,
    searchFlag: state.routeFinder.searchFlag
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