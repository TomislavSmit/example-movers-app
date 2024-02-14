import {
	EMAIL_CHANGED,
	PASSWORD_CHANGED,
	LOGIN_USER,
	LOGIN_USER_SUCCESS,
	LOGIN_USER_FAIL,
	SET_TOKEN,
	SET_USER,
	SET_USER_FAILED,
	LOGOUT_USER,
	SET_LOGGED_IN,
	LOADING,
} from "../actions/auth/types";

const INITIAL_STATE = {
	email: '',
	password: '',
	error: '',
	token: null,
	user: null,
	loading: false,
	loggedIn: null,
	loggedOut: false,
};
export default (state = INITIAL_STATE, action) => {
	console.log('Action in AuthReducer: ', action);
	switch (action.type) {
		case EMAIL_CHANGED:
			return {...state, email: action.payload, error: ''};
		case PASSWORD_CHANGED:
			return {...state, password: action.payload, error: ''};
		case LOGIN_USER:
			return {...state, loading: true};
		case LOGIN_USER_SUCCESS:
			return {...state, loggedIn: true, token: action.payload.token, user: action.payload.user};
		case SET_TOKEN:
			return {...state, loggedIn: true, token: action.payload};
		case SET_USER:
			return {...state, user: action.payload};
		case SET_USER_FAILED:
			return {...state, ...INITIAL_STATE, loggedIn: false};
		case LOGIN_USER_FAIL:
			return {...state, password: '', loggedIn: false, error: action.payload, loading: false};
		case LOGOUT_USER:
			return {...state, ...INITIAL_STATE, loggedOut: true, loggedIn: false};
		case SET_LOGGED_IN:
			return {...state,loggedIn: action.payload};
		case LOADING:
			return {...state, loading: true};
		default:
			return state;
	}
}
