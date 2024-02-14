import {
    SET_DISTANCE,
    SET_ORIGIN,
    SET_ANGLE,
} from "./types";

export const setDistance = (distance) => {
    return (dispatch) => {
        dispatch({
            type: SET_DISTANCE,
            payload: distance
        });
    }
};

export const setOrigin = () => {
    return (dispatch) => {
        navigator.geolocation.getCurrentPosition (
            (pos) => {
                dispatch({
                    type: SET_ORIGIN,
                    payload: {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }
                });
            },
            (err) => {
                console.log("ERR", err);
            }
        );
    }
};

export const setAngle = (lat,lng, oldLat, oldLong) => {
    return (dispatch) => {
        let angle = 0;
        if(oldLat !== 0){
            let dLon = (lng - oldLong);
            let y = Math.sin(dLon) * Math.cos(lat);
            let x = Math.cos(oldLat) * Math.sin(lat) - Math.sin(oldLat)
                * Math.cos(lat) * Math.cos(dLon);
            angle = Math.atan2(y, x);
            angle = angle * 180 / Math.PI;
            angle = (angle + 180) % 360;
            // angle = 360 - angle; // count degrees counter-clockwise - remove to make clockwise
        }
        // console.log('Angle!', angle);
        dispatch({
            type: SET_ANGLE,
            payload: angle
        });
    }
};
