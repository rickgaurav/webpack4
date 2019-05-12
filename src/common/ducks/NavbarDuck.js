import {createAction} from 'redux-actions';
import keyMirror from 'keymirror';

import {
	createAdjacencyList,
	getPaths,
	processStationsData
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
			const { stationNameToStationIdsMap , stationIdToStationMap, stationLineToStationsMap } = processStationsData();
			const stationToNeighboursMap = createAdjacencyList(stationLineToStationsMap, stationNameToStationIdsMap, stationIdToStationMap);
			debugger;
			getPaths(180, 242, stationToNeighboursMap, stationIdToStationMap, stationNameToStationIdsMap);
			return {
				...state,
				active_tab: action.payload.active_tab
			};
		default:
			return state;
	}	
};

export default reducer;