import React from 'react';
import {View, Text} from 'react-native';
import {FormInput, FormLabel} from "react-native-elements";
import Colors from "./Colors";

const Input = ({label, value, onChangeText, placeholder, secureTextEntry, error, keyboardType}) => {
	const {containerStyle, inputContainerStyle, inputContainerStyleRed, labelStyle, red} = styles;
	return (
		<View style={containerStyle}>
			<FormLabel labelStyle={labelStyle}>
				<Text style={error && red}>{label}</Text>
			</FormLabel>
			<FormInput
				secureTextEntry={secureTextEntry}
				placeholder={placeholder}
				autoCorrect={false}
				value={value}
				onChangeText={onChangeText}
				autoCapitalize="none"
				containerStyle={error ? inputContainerStyleRed : inputContainerStyle}
				keyboardType={keyboardType}
			/>
		</View>
	);
};

const styles = {
	containerStyle: {
		flex: 1
	},
	inputContainerStyle: {
		marginLeft: 0,
		marginRight: 0
	},
	inputContainerStyleRed: {
		marginLeft: 0,
		marginRight: 0,
		borderBottomColor: Colors.error,
	},
	labelStyle: {
		marginLeft: 0,
		marginRight: 0
	},
	red: {
		color: Colors.error,
	}
};

export {Input};
