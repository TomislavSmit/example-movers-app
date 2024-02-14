import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Card, CardSection} from "./common/";

import {logout} from "../actions/auth/index";
import {remove} from "../actions/job/index";
import Avatar from "react-native-elements/src/avatar/Avatar";
import Icon from "react-native-elements/src/icons/Icon";
import {Text, View, StyleSheet, AsyncStorage, TouchableOpacity, LayoutAnimation} from "react-native";
import Colors from "./common/Colors";

class User extends Component {
	state = {
		showMenu: false
	};

	onLogOut() {
		this.props.logout();
		this.props.remove();
		this.toggleMenu();
	}

	clearIgnoredJobs() {
		AsyncStorage.removeItem('ignoredJobs');
		this.toggleMenu();
	}

	renderMenu() {
		if (this.state.showMenu) {
			return (
				<View style={styles.profileList}>
					<TouchableOpacity
						style={styles.menuItem}
						onPress={this.onLogOut.bind(this)}>
						<Text>Log out</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.menuItem}
						onPress={this.clearIgnoredJobs.bind(this)}>
						<Text>Clear ignored</Text>
					</TouchableOpacity>
				</View>
			);
		}
	}

	toggleMenu() {
		LayoutAnimation.easeInEaseOut();
		this.setState({showMenu: !this.state.showMenu});
	}

	renderContent(user) {
		if (!user) return false;
		let userImage = this.props.user.avatar_thumbnail.length > 1 ? this.props.user.avatar_thumbnail : null;

		return (
			<View style={styles.profile}>
				<TouchableOpacity
					style={styles.menuHeading}
					onPress={() => this.toggleMenu()}
					activeOpacity={0.7}>
					{userImage !== null
						? <Avatar rounded medium source={{uri: userImage}}/>
						: <Avatar rounded medium title={this.props.user.name.charAt(0).toUpperCase()}/>}
					<Text style={styles.name}>{this.props.user.name}</Text>
					<Icon
						name={this.state.showMenu ? 'ios-arrow-up' : 'ios-arrow-down'}
						type='ionicon'
					/>
				</TouchableOpacity>
				{this.renderMenu()}
			</View>
		);
	}

	render() {
		return this.renderContent(this.props.user);
	}
}

const styles = StyleSheet.create({
	profile: {
		position: 'absolute',
		top: 30,
		left: 20,
	},
	profileList: {
		backgroundColor: Colors.backgroundColor,
		padding: 10,
		marginTop: 10,
	},
	menuHeading: {
		flexDirection: 'row',
		minWidth: 100,
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'transparent',
	},
	name: {
		paddingLeft: 15,
		paddingRight: 15,
	},
	menuItem: {
		paddingTop: 10,
		paddingBottom: 10,
		justifyContent: 'space-around',
	},
});
const mapStateToProps = state => {
	let {user} = state.auth;

	return {user};
};

export default connect(mapStateToProps, {logout, remove})(User);
