import React from 'react';
import {View, ActivityIndicator, Image} from 'react-native';

const Spinner = ({addedStyle}) => {
	let logo = require("./../../../assets/img/logos/black.png");
	return (
		<View style={[styles.spinnerStyle, addedStyle]}>
			<Image source={logo} style={styles.logo}/>
			<ActivityIndicator size='large'/>
		</View>
	);
};

const styles = {
	spinnerStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	logo: {
		width: 80,
		height: 25,
		marginBottom: 30,
		opacity: 0.3
	}
};

export {Spinner};
