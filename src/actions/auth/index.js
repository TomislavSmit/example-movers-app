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
} from "./types";
import config from "../../config";

export const emailChanged = (text) => {
	return {
		type: EMAIL_CHANGED,
		payload: text
	}
};
export const passwordChanged = (text) => {
	return {
		type: PASSWORD_CHANGED,
		payload: text
	}
};
export const login = ({email, password}) => {
	return (dispatch) => {
		dispatch({type: LOGIN_USER});
		fetch(config.api.url + 'authenticate', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		})
			.then((response) => response.json())
			.then((responseJson) => {
				if (responseJson.status === 1) {
					dispatch({
						type: LOGIN_USER_SUCCESS,
						payload: responseJson.data
					});
				} else {
					dispatch({
						type: LOGIN_USER_FAIL,
						payload: responseJson.message
					});
				}
			})
	};
};
export const setToken = ({token}) => {
	return (dispatch) => {
		dispatch({
			type: SET_TOKEN,
			payload: token
		});
	}
};
export const getUser = ({token}) => {
	return (dispatch) => {
		fetch(config.api.url + 'user', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json',
			}
		}).then((response) => {
			if (response.status !== 200) {
				dispatch({
					type: SET_USER_FAILED,
					payload: null
				});
			}
			response.json().then(responseJson => {
				dispatch({
					type: SET_USER,
					payload: responseJson.data
				});
			});
		})
			.catch((error) => {
				console.error("Error in getUser: ", error);
			});
	};
};
export const setLoggedIn = (boolean) => {
	return (dispatch) => {
		dispatch({
			type: SET_LOGGED_IN,
			payload: boolean
		});
	}
};
export const logout = () => {
	return (dispatch) => {
		dispatch({
			type: LOGOUT_USER,
			payload: {}
		});
	}
};
