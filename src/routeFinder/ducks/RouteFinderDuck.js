import {createAction} from 'redux-actions';
import keyMirror from 'keymirror';
import {processStationsData, createAdjacencyList, getPaths} from "../../helpers/station-helpers";


const ACTION_TYPES = keyMirror({
  INIT_STATIONS: null,
  GET_PATHS: null,
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
  }
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
      const result = getPaths(
        sourceId,
        destinationId,
        stationToNeighboursMap,
        stationIdToStationMap,
        stationNameToStationIdsMap,
        maxStations,
        maxTime
      );
      return {
        allRoutes: result.allRoutes
      }
  }
);


const reducer = (state, action) => {
  state = state || initial_state;

  switch(action.type) {
    case ACTION_TYPES.INIT_STATIONS:
      return {
        ...state,
        stationLineToStationsMap: action.payload.stationLineToStationsMap,
        stationIdToStationMap: action.payload.stationIdToStationMap,
        stationNameToStationIdsMap: action.payload.stationNameToStationIdsMap,
        stationToNeighboursMap: action.payload.stationToNeighboursMap
      };

    case ACTION_TYPES.GET_PATHS:
      return {
        ...state,
        allRoutes: action.payload.allRoutes
      };
    default:
      return state;

  }
};

export default reducer;