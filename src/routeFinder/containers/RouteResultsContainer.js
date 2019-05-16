import {connect} from 'react-redux';
import RouteResults from "../components/RouteResults";

const mapStateToProps = state => {
  return {
    allRoutes: state.routeFinder.allRoutes,
    stationNameToStationIdsMap :state.routeFinder.stationNameToStationIdsMap,
    stationIdToStationMap :state.routeFinder.stationIdToStationMap
  };
};

export default connect(
  mapStateToProps,
  null
)(RouteResults);