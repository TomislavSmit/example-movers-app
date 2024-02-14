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
	UPLOAD_IMAGES_ERROR,
	UPLOAD_IMAGES_ERROR_RESET,
	ERROR_SET_ESTIMATED_HOURS,
	ALREADY_TAKEN,
} from "./types";
import config from '../../config';
import constants from "../../constants";

export const getFirst = (token, ignoredJobs) => {
	return (dispatch) => {
		fetch(config.api.url + 'jobs/first?ignored=' + ignoredJobs, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json',
			}
		}).then((response) => response.json())
			.then((responseJson) => {
				if (responseJson.status === 1) {
					const addressTypes = {pickup: 1, delivery: 2};

					let address = (jobData, type) => {
						return jobData.route.addresses.reduce((sum = {}, address) => {
							return address.type === addressTypes[type] ? address : sum;
						});
					};
					let destination = (responseJson.data.status < constants.STATUS_DELIVERY_ARRIVING)
						? address(responseJson.data, "pickup")
						: address(responseJson.data, "delivery");
					dispatch({
						type: JOB_FOUND,
						payload: {
							jobData: responseJson.data,
							destination: {
								latitude: parseFloat(destination.latitude),
								longitude: parseFloat(destination.longitude)
							}
						},
					});
				} else {
					dispatch({
						type: JOB_NOT_FOUND,
						payload: 'Job not found'
					});
				}
			})
	};
};
export const accept = (id, token) => {
	return (dispatch) => {
		dispatch({type: LOADING});
		fetch(config.api.url + 'jobs/' + id + '/accept', {
			method: 'PUT',
			headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json',
			}
		}).then((response) => response.json())
			.then((responseJson) => {
				if (responseJson.status === 2) {
					dispatch({
						type: ALREADY_TAKEN,
						payload: responseJson.message
					});
				} else {
					dispatch({
						type: ACCEPT,
						payload: responseJson.data
					});
				}
			})
			.catch((error) => {
				console.warn("Error from api on acceptJob", error);
			});
	}
};
export const ignore = (id = null) => {
	return (dispatch) => {
		dispatch({
			type: IGNORE,
			payload: id
		});
	}
};
export const remove = () => {
	return (dispatch) => {
		dispatch({
			type: REMOVE,
			payload: null
		});
	}
};
export const cancel = (id, token) => {
	return (dispatch) => {
		dispatch({type: LOADING});
		fetch(config.api.url + 'jobs/cancel', {
			method: 'PUT',
			headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json',
			}
		}).then((response) => response.json())
			.then((responseJson) => {
				dispatch({
					type: CANCEL,
					payload: id
				});
			})
			.catch((error) => {
				console.warn("Error cancelling job: ", error);
			});
	}
};
export const getActive = (token) => {
	return (dispatch) => {
		fetch(config.api.url + 'jobs/active-mover-job', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json',
			}
		}).then((response) => response.json())
			.then((responseJson) => {
				// if paused, don't change status to 20 on mobile app, so the screen remains the same
				responseJson.data.status = responseJson.data.status === 20
					? responseJson.data.old_status
					: responseJson.data.status;
				if (responseJson.status !== 1) {
					dispatch({
						type: NO_ACTIVE,
						payload: responseJson.message
					});
				} else if (responseJson.data.status === 31) {
					dispatch({
						type: CANCEL
					});
				} else {
					const addressTypes = {pickup: 1, delivery: 2};

					let address = (jobData, type) => {
						return jobData.route.addresses.reduce((sum = {}, address) => {
							return address.type === addressTypes[type] ? address : sum;
						});
					};
					let destination = (responseJson.data.status < constants.STATUS_DELIVERY_ARRIVING)
						? address(responseJson.data, "pickup")
						: address(responseJson.data, "delivery");
					dispatch({
						type: FOUND_ACTIVE,
						payload: {
							jobData: responseJson.data,
							destination: {
								latitude: parseFloat(destination.latitude),
								longitude: parseFloat(destination.longitude)
							}
						},
					});
				}
			})
			.catch((error) => {
				console.warn("Error getActive action: ", error);
			});
	}
};
export const nextStatus = (token) => {
	return (dispatch) => {
		dispatch({type: LOADING});
		fetch(config.api.url + 'jobs/status/next', {
			method: 'PUT',
			headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json',
			}
		}).then((response) => response.json())
			.then((responseJson) => {
				const addressTypes = {pickup: 1, delivery: 2};

				let address = (jobData, type) => {
					return jobData.route.addresses.reduce((sum = {}, address) => {
						return address.type === addressTypes[type] ? address : sum;
					});
				};
				let destination = (responseJson.data.status < constants.STATUS_DELIVERY_ARRIVING)
					? address(responseJson.data, "pickup")
					: address(responseJson.data, "delivery");
				dispatch({
					type: NEXT_STATUS,
					payload: {
						jobData: responseJson.data,
						destination: {
							latitude: parseFloat(destination.latitude),
							longitude: parseFloat(destination.longitude)
						}
					},
				});
			})
			.catch((error) => {
				console.warn("Error from api on nextStatus: ", error);
			});
	}
};
export const pause = (token) => {
	return (dispatch) => {
		dispatch({type: LOADING});
		fetch(config.api.url + 'jobs/status/pause', {
			method: 'PUT',
			headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json',
			}
		}).then((response) => response.json())
			.then((responseJson) => {
			console.log('data paused: ', responseJson);
				// if paused, don't change status to 20 on mobile app, so the screen remains the same
				responseJson.data.status = responseJson.data.status === 20
					? responseJson.data.old_status
					: responseJson.data.status;
				if (!responseJson.data.is_timer_running) {
					dispatch({
						type: UNPAUSE,
						payload: responseJson.data
					});
				} else {
					dispatch({
						type: PAUSE,
						payload: responseJson.data
					});
				}
			})
			.catch((error) => {
				console.warn("Error in pause: ", error);
			});
	}
};
// export const finishEstimate = (imgListArrStateSliced, parent.props, parent.state.estimatedHours) => {
export const finishEstimate = (imgListArrStateSliced, props, estimatedHours) => {
	return (dispatch) => {
		dispatch({type: LOADING});
		fetch(config.api.url + 'jobs/estimatedHours/' + props.jobData.id, {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + props.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				estimated_hours: estimatedHours
			})
		}).then((response) => response.json())
			.then((responseJson) => {
				console.log('setEstimatedHours response: ', responseJson);
				if (responseJson.status !== 1) {
					dispatch({
						type: ERROR_SET_ESTIMATED_HOURS,
						payload: 'Error setting estimated hours'
					});
				} else {
					// console.log('type:', props.type);
					dispatch(sendPhotos(imgListArrStateSliced, props.jobData, props.token, props.type));
				}
			})
			.catch((error) => {
				console.warn("Error in finishEstimate: ", error);
			})
	}
};
export const sendPhotos = (imgListArrStateSliced, jobData, token, addressType) => {
	return (dispatch) => {
		dispatch({type: LOADING});
		if (imgListArrStateSliced.length > 0) {
			imgListArrStateSliced.forEach(function callback(currentValue, index) {
				let data = new FormData();
				let address = jobData.route.addresses.filter(addresses => addresses.type === addressType);
				data.append('image', {
					'name': 'name.jpg',
					'type': "image/" + (currentValue.imgSrc.url.split(".").pop() || "jpg"),
					'uri': currentValue.imgSrc.url
				});
				data.append('filename', currentValue.imgSrc.url.split("/").pop());
				data.append('description', currentValue.description);
				data.append('address_id', address[0].id);
				console.log('data to send: ', JSON.stringify(data));

				fetch(config.api.url + 'job/' + jobData.id + '/image', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Authorization': 'Bearer ' + token,
						'Content-Type': 'multipart/form-data;',
					},
					body: data,
				}).then((response) => response.json())
					.then((responseJson) => {
						console.log('sendPhoto responseJson: ', responseJson);
						if (responseJson.status !== 1) {
							dispatch({
								type: UPLOAD_IMAGES_ERROR,
								payload: "Error uploading images. Please try again."
							});
						} else if (imgListArrStateSliced.length === index + 1) {
							dispatch(nextStatus(token));
						}
					})
					.catch(err => {
						console.warn("Error uploading images", err);
					})
			});
		} else {
			dispatch(nextStatus(token));
		}
	}
};
export const resetError = () => {
	return (dispatch) => {
		dispatch({type: UPLOAD_IMAGES_ERROR_RESET});
	}
};
