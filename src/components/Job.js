import React, {Component} from 'react';
import {View, AsyncStorage} from "react-native";
import {connect} from 'react-redux';
import {Button, Spinner} from "./common/";
import {accept, getActive} from "../actions/job/index";
import PendingJob from "./PendingJob";
import ActiveJob from "./ActiveJob";
import User from "./User";
import Map from "./Map";

const Permissions = require('react-native-permissions');

class Job extends Component {

	componentDidMount() {
		this.props.getActive(this.props.token);
		Permissions.checkMultiple(['camera', 'photo'])
			.then(response => {
				//response is an object mapping type to permission
				this.setState({
					cameraPermission: response.camera,
					photoPermission: response.photo,
				})
			});
	};

	renderContent() {
		if (this.props.loading) {
			return <Spinner/>;
		}

		if (this.props.active) {
			return <ActiveJob/>;
		} else if (this.props.active === false) {
			return <PendingJob/>;
		}

		return <Spinner/>;
	}

	renderHeader() {
		return (
			<User/>
		);
	}

	render() {
		return (
			<View style={{flex: 1, justifyContent: 'flex-end'}}>
				<Map/>
				{this.renderHeader()}
				{this.renderContent()}
			</View>
		)
	}
}

const mapStateToProps = state => {
	let {token} = state.auth;
	let {accepted, active, loading} = state.job;

	return {token, accepted, active, loading};
};

export default connect(mapStateToProps, {accept, getActive})(Job);
