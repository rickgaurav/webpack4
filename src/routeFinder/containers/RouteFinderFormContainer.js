import {connect} from 'react-redux';
import {getRoutes, initStationsData} from "../ducks/RouteFinderDuck";
import RouteFinderForm from "../components/RouteFinderForm";

const mapStateToProps = state => {
  return {
    from: state.routeFinder.formData.from,
    to: state.routeFinder.formData.to,
    maxStations: state.routeFinder.formData.maxStationsOnRoute,
    maxTravelTime: state.routeFinder.formData.maxTravelTime,
    stationToNeighboursMap :state.routeFinder.stationToNeighboursMap,
    stationNameToStationIdsMap :state.routeFinder.stationNameToStationIdsMap,
    stationIdToStationMap :state.routeFinder.stationIdToStationMap
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  return {
    ...stateProps,
    ...dispatchProps,
    getRoutes: (sourceId, destinationId, maxStations, maxTime) =>
      dispatch(
        getRoutes(
          dispatch,
          sourceId,
          destinationId,
          stateProps.stationToNeighboursMap,
          stateProps.stationIdToStationMap,
          stateProps.stationNameToStationIdsMap,
          maxStations,
          maxTime
        )
      )
  }
};

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(RouteFinderForm);