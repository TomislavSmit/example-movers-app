import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Colors from "./Colors";
import Ionicons from "react-native-vector-icons/Ionicons";

const Button = ({onPress, children, disabled, backgroundColor, iconName}) => {
	const {containerStyle, buttonStyle, text, disabledButton} = styles;
	return (
		<View style={[containerStyle]}>
			<TouchableOpacity
				disabled={disabled}
				backgroundColor={backgroundColor || Colors.tintColor}
				onPress={onPress}
				style={[buttonStyle, disabled && disabledButton]}>

				{iconName ?
				<Ionicons
					name={iconName}
					size={24}
					color={Colors.lightText}
				/> :
					<Text style={text}>{children}</Text>
				}

			</TouchableOpacity>
		</View>
	);
};

const styles = {
	containerStyle: {
		flex: 1,
	},
	buttonStyle: {
		marginLeft: 0,
		marginRight: 0,
		padding: 16,
		borderColor: Colors.tintColor,
		backgroundColor: Colors.tintColor,
		borderRadius: 8,
		alignItems: 'center'
	},
	text: {
		fontSize: 16,
		color: Colors.lightText,
	},
	disabledButton: {
		backgroundColor: Colors.disabledButton,
	}
};

export {Button};
