import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import MapView from "react-native-maps";
import Polyline from '@mapbox/polyline';
import {setDistance, setOrigin, setAngle} from "../actions/map";
import constants from "../constants";
import {Spinner} from "./common";

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coords: [],
            region: {
                latitude: 34.052234,
                longitude: -118.243685,
                latitudeDelta: 0.1,
                longitudeDelta: 0.05,
            }
        }
    }

    componentWillMount() {
        this.props.setOrigin();
        this.watchOrigin = navigator.geolocation.watchPosition(
            (pos) => {
                console.log("WATCH ORIGIN POSITION", pos);
                if (this.props.origin) {
                    this.props.setAngle(pos.coords.latitude, pos.coords.longitude, this.props.origin.latitude, this.props.origin.longitude);
                }
                this.props.setOrigin();
            },
            (err) => {
                console.log("Watch origin ERR", err);
            }
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.origin && this.props.destination && !this.props.distance) {
            this.getDirections();
        }
        if (prevProps.destination !== null
            && (prevProps.destination.latitude !== this.props.destination.latitude
                || prevProps.destination.longitude !== this.props.destination.longitude)) {
            this.getDirections();
        }
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchOrigin);
    }

    getDirections() {
        const origin = `${this.props.origin.latitude},${this.props.origin.longitude}`;
        const destination = `${this.props.destination.latitude},${this.props.destination.longitude}`;
        const APIKEY = 'example_key';
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${APIKEY}&mode=driving`;

        console.log("URL", url);
        fetch(url)
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.routes.length) {
                    let points = Polyline.decode(responseJson.routes[0].overview_polyline.points);
                    let coords = points.map((point, index) => {
                        return {
                            latitude: point[0],
                            longitude: point[1]
                        }
                    });
                    this.setState({coords});
                    this.props.setDistance(responseJson.routes[0].legs[0].distance.text);
                }
            }).catch(e => {
            console.warn(e)
        });
    }

    renderTruck() {
        if (this.props.origin) {
            return (
                <MapView.Marker
                    coordinate={this.props.origin}
                    style={{transform: [{rotate:`${this.props.angle}deg`}]}}
                    image={require('../../assets/img/truck1x.png')}
                />
            );
        }
    }

    renderDestination() {
        if (this.props.destination) {
            return (
                <MapView.Marker
                    coordinate={this.props.destination}
                />
            );
        }
    }

    renderPath() {
        if (this.state.coords.length) {
            return (
                <MapView.Polyline
                    coordinates={this.state.coords}
                    strokeWidth={4}
                />
            );
        }
    }

    render() {
        return this.props.origin && (
            <MapView
                style={{...StyleSheet.absoluteFillObject}}
                initialRegion={{...this.state.region, ...this.props.origin}}
                followsUserLocation={true}
            >
                {this.renderTruck()}
                {this.renderDestination()}
                {this.renderPath()}
            </MapView>
        );
    }
}

const mapStateToProps = state => {
    let {jobData, destination} = state.job;
    let {distance, origin, angle} = state.map;

    return {jobData, destination, distance, origin, angle};
};

export default connect(mapStateToProps, {setDistance, setOrigin, setAngle})(Map);
