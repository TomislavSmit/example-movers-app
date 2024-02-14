import React, {Component} from 'react';
import {View, AsyncStorage} from 'react-native';

import LoginForm from '../components/LoginForm';
import {connect} from 'react-redux';
import {Spinner} from "./common/";
import {setToken, setLoggedIn, getUser} from "../actions/auth/index";
import {TabNavigation} from "./TabNavigation";

class Application extends Component {
	componentWillMount() {
		AsyncStorage.getItem('token')
			.then((token) => {
				if (token) {
					this.props.setToken({token});
					this.props.getUser({token});
				} else {
					this.props.setLoggedIn(false);
				}
			});
	}

	componentDidUpdate() {
		if (this.props.token) {
			AsyncStorage.setItem('token', this.props.token);
		} else if (this.props.loggedOut) {
			AsyncStorage.removeItem('token');
		}
	}

	renderContent() {
		if (this.props.loggedIn === true) {
			return <TabNavigation/>;
		} else if (this.props.loggedIn === false) {
			return <LoginForm/>;
		}

		return <Spinner/>
	}

	render() {
		return (
			<View style={{flex: 1, marginTop: 20}}>
				{this.renderContent()}
			</View>
		);
	}
}

const mapStateToProps = state => {
	let {loggedIn, token, loggedOut, user} = state.auth;

	return {loggedIn, token, loggedOut, user};
};

export default connect(mapStateToProps, {setToken, setLoggedIn, getUser})(Application);
