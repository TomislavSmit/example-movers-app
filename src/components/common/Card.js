import React from 'react';
import {View} from 'react-native';
import Colors from './Colors';

const Card = (props) => {
	return (
		<View style={styles.containerStyle}>
			{props.children}
		</View>
	);
};

const styles = {
	containerStyle: {
		elevation: 1,
		margin: 15,
		marginTop: 10,
        backgroundColor: Colors.backgroundColor
	}
};

export {Card};
