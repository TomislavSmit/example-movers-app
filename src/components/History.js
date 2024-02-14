import React, {Component} from 'react';
import {
	Button,
	View,
	Text,
} from 'react-native';
import {Card, CardSection, CardHeader, Spinner, RowDivider} from "./common/";

export default class History extends Component {
	render() {
		return (
			<Card>
				<CardSection>
					<CardHeader>History</CardHeader>
				</CardSection>
				<CardSection>
					<View style={{flexDirection: 'column'}}>
						<Text>No previous moves</Text>
					</View>
				</CardSection>
			</Card>
		)
	}
}
