import {connect} from 'react-redux';
import { getRoutes, toggleLoading } from "../ducks/RouteFinderDuck";
import RouteFinderForm from "../components/RouteFinderForm";

const mapStateToProps = state => {
  return {
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
      ),

    toggleLoading: () => dispatch(toggleLoading(dispatch, true))
  }
};

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(RouteFinderForm);