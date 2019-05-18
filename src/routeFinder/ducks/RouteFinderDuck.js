import {createAction} from 'redux-actions';
import keyMirror from 'keymirror';
import {processStationsData, createAdjacencyList, getPaths} from "../../helpers/station-helpers";


const ACTION_TYPES = keyMirror({
  INIT_STATIONS: null,
  GET_PATHS: null,
  TOGGLE_LOADING: null,
});

const initial_state = {
  stationLineToStationsMap: {},
  stationToNeighboursMap: {},
  stationIdToStationMap: {},
  stationNameToStationIdsMap: {},
  allRoutes: [],
  formData: {
    from: {},
    to: {},
    maxStationsOnRoute: null,
    maxTravelTime: null
  },
  loading: false
};

export const initStationsData = createAction(
  ACTION_TYPES.INIT_STATIONS,
  () => {
    const {
      stationLineToStationsMap,
      stationIdToStationMap,
      stationNameToStationIdsMap
    } = processStationsData();

    const stationToNeighboursMap = createAdjacencyList(stationLineToStationsMap);
    return {
      stationLineToStationsMap,
      stationIdToStationMap,
      stationNameToStationIdsMap,
      stationToNeighboursMap
    };
  }
);

export const getRoutes = createAction(
  ACTION_TYPES.GET_PATHS,
  (
   dispatch,
   sourceId,
   destinationId,
   stationToNeighboursMap,
   stationIdToStationMap,
   stationNameToStationIdsMap,
   maxStations,
   maxTime
  ) => {

      // dispatch(toggleLoading(dispatch, true));
      const result = getPaths(
        sourceId,
        destinationId,
        stationToNeighboursMap,
        stationIdToStationMap,
        stationNameToStationIdsMap,
        maxStations,
        maxTime
      );
      dispatch(toggleLoading(dispatch, false));
      return {
        allRoutes: result.allRoutes,
      }
  }
);

export const toggleLoading = createAction(
  ACTION_TYPES.TOGGLE_LOADING,
  (dispatch, loading) => ({ loading })
);


const reducer = (state, { type, payload }) => {
  state = state || initial_state;

  switch(type) {
    case ACTION_TYPES.INIT_STATIONS:
      return {
        ...state,
        stationLineToStationsMap: payload.stationLineToStationsMap,
        stationIdToStationMap: payload.stationIdToStationMap,
        stationNameToStationIdsMap: payload.stationNameToStationIdsMap,
        stationToNeighboursMap: payload.stationToNeighboursMap
      };

    case ACTION_TYPES.GET_PATHS:
      return {
        ...state,
        allRoutes: payload.allRoutes
      };

      case ACTION_TYPES.TOGGLE_LOADING:
        debugger
      return {
        ...state,
        loading: payload.loading
      };
    default:
      return state;

  }
};

export default reducer;