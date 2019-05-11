import {createAction} from 'redux-actions';
import keyMirror from 'keymirror';

import {
	getRoutes,
	getStationLineToStationsAndStationToLinesMap,
	getStationToNeighboursMap
} from '../../helpers/station-helpers';

const ACTION_TYPES = keyMirror({
	SET_ACTIVE_TAB: null
});

const initial_state = {
	active_tab: 'all'
};

export const setActiveTabAction = createAction(
	ACTION_TYPES.SET_ACTIVE_TAB,
	(dispatch, active_tab) => ({active_tab})
);


const reducer = (state, action) => {
	state = state || initial_state;

	switch(action.type) {
		case ACTION_TYPES.SET_ACTIVE_TAB:
			console.log("In action");
			const { stationToLinesMap , stationLineToStationsMap, stationIdToStationMap } = getStationLineToStationsAndStationToLinesMap();
			const stationToNeighboursMap = getStationToNeighboursMap(Object.values(stationLineToStationsMap));

			getRoutes(12, 66, stationToNeighboursMap, stationIdToStationMap);
			return {
				...state,
				active_tab: action.payload.active_tab
			};
		default:
			return state;

	}	
}

export default reducer;