import React, {Component} from 'react';
import {View} from "react-native";
import BackgroundGeolocation from "react-native-background-geolocation";
import {connect} from 'react-redux';

import config from "../config";

class BroadcastLocation extends Component {
    componentWillMount() {
        // 1.  Wire up event-listeners

        // This handler fires whenever bgGeo receives a location update.
        BackgroundGeolocation.on('location', this.onLocation.bind(this));

        // This handler fires whenever bgGeo receives an error
        BackgroundGeolocation.on('error', this.onError);

        // This handler fires when movement states changes (stationary->moving; moving->stationary)
        BackgroundGeolocation.on('motionchange', this.onMotionChange);

        // This event fires when a change in motion activity is detected
        BackgroundGeolocation.on('activitychange', this.onActivityChange);

        // This event fires when the user toggles location-services
        BackgroundGeolocation.on('providerchange', this.onProviderChange);

        // 2.  #configure the plugin (just once for life-time of app)
        BackgroundGeolocation.configure({
            // Geolocation Config
            desiredAccuracy: 0,
            distanceFilter: 1,
            // Activity Recognition
            stopTimeout: 1,
            // Application config
            debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
            startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
            // HTTP / SQLite config
            url: 'http://yourserver.com/locations',
            batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
            autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
            headers: {              // <-- Optional HTTP headers
                "X-FOO": "bar"
            },
            params: {               // <-- Optional HTTP params
                "auth_token": "maybe_your_server_authenticates_via_token_YES?"
            }
        }, (state) => {
            // console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

            if (!state.enabled) {
                // 3. Start tracking!
                BackgroundGeolocation.start(function () {
                    console.log("- Start success");
                });
            }
        });
    }

    // You must remove listeners when your component unmounts
    componentWillUnmount() {
        // Remove BackgroundGeolocation listeners
        BackgroundGeolocation.un('location', this.onLocation);
        BackgroundGeolocation.un('error', this.onError);
        BackgroundGeolocation.un('motionchange', this.onMotionChange);
        BackgroundGeolocation.un('activitychange', this.onActivityChange);
        BackgroundGeolocation.un('providerchange', this.onProviderChange);
    }

    onLocation(location) {
        // console.log('- [js]location: ', JSON.stringify(location));
        // console.log("lat", location.coords.latitude);
        // console.log("long", location.coords.longitude);
        this.broadcastLocation(location);
    }

    broadcastLocation = (location) => {
        console.log("Location", location);
        if (this.props.token && this.props.jobData) {
            fetch(config.api.url + 'jobs/broadcast-location', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + this.props.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    angle: this.props.angle
                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log("broadcast-location", responseJson);
                })
                .catch((error) => {
                    console.warn("Error from api on acceptJob", error);
                });

            fetch(config.api.url + 'trucks/' + this.props.jobData.truck.id, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + this.props.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log("truck update location", responseJson);
                })
                .catch((error) => {
                    console.warn("Error from api on acceptJob truck location", error);
                });
        }
    };

    onError(error) {
        var type = error.type;
        var code = error.code;
        alert(type + " Error: " + code);
    }

    onActivityChange(activityName) {
        console.log('- Current motion activity: ', activityName);  // eg: 'on_foot', 'still', 'in_vehicle'
    }

    onProviderChange(provider) {
        console.log('- Location provider changed: ', provider.enabled);
    }

    onMotionChange(location) {
        console.log('- [js]motionchanged: ', JSON.stringify(location));
    }

    render() {
        return <View/>;
    }
}

const mapStateToProps = state => {
    let {token} = state.auth;
    let {jobData} = state.job;
    let {angle} = state.map;

    return {token, jobData, angle};
};

export default connect(mapStateToProps, {})(BroadcastLocation);
