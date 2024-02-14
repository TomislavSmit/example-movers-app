import React from 'react';
import {View} from 'react-native';

const CardSection = (props) => {
	return (
		<View style={[styles.containerStyle, props.addedStyle]}>
			{props.children}
		</View>
	);
};

const styles = {
	containerStyle: {
		padding: 20,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		position: 'relative',
	}
};


export {CardSection};
