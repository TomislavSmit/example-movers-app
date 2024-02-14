import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import JobReducer from './JobReducer';
import MapReducer from './MapReducer';

export default combineReducers({
	auth: AuthReducer,
	job: JobReducer,
	map: MapReducer,
})
