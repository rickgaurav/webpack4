import {connect} from 'react-redux';
import RouteResults from "../components/RouteResults";

const mapStateToProps = state => {
  return {
    allRoutes: state.routeFinder.allRoutes
  };
};

export default connect(
  mapStateToProps,
  null
)(RouteResults);