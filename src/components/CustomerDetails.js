import React, {Component} from 'react';
import {Button, Card, CardSection, CardHeader, Spinner, RowDivider} from "./common/";
import {connect} from 'react-redux';
import moment from 'moment';
import {getFirst, accept, cancel, nextStatus} from "../actions/job/index";
import {Text, View, AsyncStorage} from "react-native";
import constants from "../constants";
import Avatar from "react-native-elements/src/avatar/Avatar";

class CustomerDetails extends Component {

	renderContent(jobData) {
		if (!jobData) return null;

		let customerImage = jobData.customer.avatar_thumbnail.length > 1 ? jobData.customer.avatar_thumbnail : null;
		customerImage = null;

		console.log('image: ', customerImage);
		return (
			<View>
				<CardSection>
					<CardHeader>
						<Text>Customer details</Text>
					</CardHeader>
				</CardSection>
				<CardSection>
					<View style={{flexDirection: 'row'}}>
						<View>
							{customerImage !== null
								? <Avatar rounded large source={{uri: customerImage}}/>
								: <Avatar rounded large title={jobData.customer.name.charAt(0).toUpperCase()}/>}
						</View>
						<View style={styles.detailsView}>
							<Text>Name: {jobData.customer.name}</Text>
							<Text>Email: {jobData.customer.email}</Text>
						</View>
					</View>
				</CardSection>
			</View>
		);
	}

	render() {
		return this.renderContent(this.props.jobData);
	}
}

const styles = {
	detailsView: {
		flexDirection: 'column',
		paddingLeft: 20
	}
};
const mapStateToProps = state => {
	let {jobData} = state.job;

	return {jobData};
};

export default connect(mapStateToProps, {accept, getFirst, cancel, nextStatus})(CustomerDetails);
