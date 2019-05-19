import {connect} from 'react-redux';
import RouteResults from "../components/RouteResults";

const mapStateToProps = state => {
  return {
    transferSortedRoutes: state.routeFinder.transferSortedRoutes,
    timeSortedRoutes: state.routeFinder.timeSortedRoutes,
    stationNameToStationIdsMap :state.routeFinder.stationNameToStationIdsMap,
    stationIdToStationMap :state.routeFinder.stationIdToStationMap,
  };
};

export default connect(
  mapStateToProps,
  null
)(RouteResults);