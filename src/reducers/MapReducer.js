import {
	SET_DISTANCE,
	SET_ORIGIN,
	SET_ANGLE,
} from "../actions/map/types";

const INITIAL_STATE = {
	distance: 0,
	origin: null,
	angle: 0,
};
export default (state = INITIAL_STATE, action) => {
	console.log('Action in MapReducer: ', action);
	switch (action.type) {
		case SET_DISTANCE:
			return {...state, distance: action.payload};
		case SET_ORIGIN:
			return {...state, origin: action.payload};
		case SET_ANGLE:
			return {...state, angle: action.payload};
		default:
			return state;
	}
}
