import React from 'react';

import {Platform} from 'react-native';
import Job from "./Job";
import History from "./History";
import {TabNavigator} from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from "./common/Colors";


const TabNavigation = TabNavigator({
	Job: {
		screen: Job,
		navigationOptions: {
			title: 'Job'
		}
	},
	History: {
		screen: History,
		navigationOptions: {
			title: 'History'
		}
	},
}, {
	navigationOptions: ({navigation}) => ({
		tabBarIcon: ({focused}) => {
			const {routeName} = navigation.state;
			let iconName;
			switch (routeName) {
				case 'Job':
					iconName = Platform.OS === 'ios'
						? `ios-briefcase${focused ? '' : '-outline'}`
						: 'md-home';
					break;
				case 'History':
					iconName = Platform.OS === 'ios'
						? `ios-list${focused ? '' : '-outline'}`
						: 'md-time';
					break;
			}
			return (
				<Ionicons
					name={iconName}
					size={28}
					style={{marginBottom: -3}}
					color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
				/>
			);
		},
	}),
	tabBarPosition: 'bottom',
	swipeEnabled: false,
	animationEnabled: true,
	tabBarOptions: {
		activeTintColor: Colors.tabIconSelected,
	},
});

export {TabNavigation};