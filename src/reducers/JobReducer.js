import {
	GET,
	ACCEPT,
	IGNORE,
	REMOVE,
	CANCEL,
	NEXT_STATUS,
	JOB_FOUND,
	JOB_NOT_FOUND,
	FOUND_ACTIVE,
	NO_ACTIVE,
	LOADING,
	PAUSE,
	UNPAUSE,
	ENABLE_NEXT,
	TIME_ESTIMATE,
	UPLOAD_IMAGES_ERROR,
	UPLOAD_IMAGES_ERROR_RESET,
	ERROR_SET_ESTIMATED_HOURS,
	ALREADY_TAKEN,
} from "../actions/job/types";

const INITIAL_STATE = {
	jobStatus: null,
	jobData: null,
    destination: null,
	accepted: null,
	active: null,
	ignored: null,
	nextButtonEnabled: true,
	imagesUploadError: false,
};
export default (state = INITIAL_STATE, action) => {
	console.log('Action in JobReducer: ', action);
	switch (action.type) {
		case JOB_FOUND:
			return {...state, jobData: action.payload.jobData, destination: action.payload.destination};
		case JOB_NOT_FOUND:
			return {...state, jobData: null};
		case ACCEPT:
			return {...state, jobData: action.payload, active: true, loading: false};
		case IGNORE:
			return {...state, jobData: null, ignored: true};
		case REMOVE:
			return {...state, ...INITIAL_STATE, jobData: null};
		case CANCEL:
			return {...state, jobData: null, active: false, cancelled: true, loading: false};
		case FOUND_ACTIVE:
			return {...state, jobData: action.payload.jobData, active: true, destination: action.payload.destination};
		case NO_ACTIVE:
			return {...state, jobData: null, active: false, loading: false};
		case NEXT_STATUS:
			return {...state, jobData: action.payload.jobData, destination: action.payload.destination, loading: false};
		case PAUSE:
			return {...state, jobData: action.payload, loading: false};
		case TIME_ESTIMATE:
			return {...state, loading: false, timeEstimate: true};
		case UPLOAD_IMAGES_ERROR:
			return {...state, loading: false, error: action.payload};
		case UPLOAD_IMAGES_ERROR_RESET:
			return {...state, error: ''};
		case ERROR_SET_ESTIMATED_HOURS:
			return {...state, loading: false, error: action.payload};
		case ALREADY_TAKEN:
			return {...state, jobData: null, loading: false, error: action.payload};
		case UNPAUSE:
			return {...state, jobData: action.payload, loading: false};
		case LOADING:
			return {...state, loading: true};
		default:
			return state;
	}
}
