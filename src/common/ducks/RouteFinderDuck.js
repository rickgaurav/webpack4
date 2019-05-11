import {createAction} from 'redux-actions';
import keyMirror from 'keymirror';
import {
  getRoutes,
  getStationLineToStationsAndStationToLinesMap,
  getStationToNeighboursMap
} from "../../helpers/station-helpers";

const ACTION_TYPES = keyMirror({
  INIT_STATIONS: null,
  GET_PATHS: null,
});

const initial_state = {
  stationToLinesMap: {},
  stationToNeighboursMap: {},
  stationIdToStationMap: {}
};

export const initStationsData = createAction(
  ACTION_TYPES.INIT_STATIONS,
  dispatch => {
    const { stationToLinesMap , stationLineToStationsMap, stationIdToStationMap } = getStationLineToStationsAndStationToLinesMap();
    const stationToNeighboursMap = getStationToNeighboursMap(Object.values(stationLineToStationsMap));
    return {
      stationToLinesMap,
      stationToNeighboursMap,
      stationIdToStationMap
    };
  }
);

export const getPaths = createAction(
  ACTION_TYPES.GET_PATHS,
  (dispatch, sourceId, destinationId, stationToNeighboursMap, stationIdToStationMap) => {
    const routes = getRoutes(sourceId, destinationId, stationToNeighboursMap, stationIdToStationMap);
  }
);


const reducer = (state, action) => {
  state = state || initial_state;

  switch(action.type) {
    case ACTION_TYPES.INIT_STATIONS:
      return {
        ...state,
        stationToNeighboursMap: action.payload.stationToNeighboursMap,
        stationToLinesMap: action.payload.stationToLinesMap
      };
    default:
      return state;

  }
};

export default reducer;