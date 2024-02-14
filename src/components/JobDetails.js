import React, {Component} from 'react';
import {Button, Card, CardSection, CardHeader, Spinner, RowDivider} from "./common/";
import {connect} from 'react-redux';
import moment from 'moment';
import {getFirst, accept, cancel, nextStatus} from "../actions/job/index";
import {Text, View, AsyncStorage} from "react-native";
import constants from "../constants";

class JobDetails extends Component {
	constructor(props) {
		super(props);
	}
	addressTypes = {pickup: 1, delivery: 2};

	address(jobData, type) {
		return jobData.route.addresses.reduce((sum = {}, address) => {
			return address.type === this.addressTypes[type] ? address : sum;
		});
	}

	renderContent(jobData) {
		if (this.props.loading) {
			return <Spinner/>;
		}

		if (!jobData) return <Text>Error. Please try refreshing the application.</Text>;

		return (
			<View>
				<CardSection>
					<CardHeader>{this.props.headerText
						? <Text>{this.props.headerText}</Text>
						: <Text>Job details</Text>}</CardHeader>
				</CardSection>
				<CardSection>
					<View style={{flexDirection: 'column'}}>
						<Text>Id: {jobData.id}, Status: {jobData.status} </Text>
						<Text>Pickup: {this.address(jobData, "pickup").full_address} </Text>
						<Text>Delivery: {this.address(jobData, "delivery").full_address} </Text>
						<Text>Size: {this.address(jobData, "pickup").size.name} </Text>
						<Text>Price: {jobData.max_price} </Text>
						<Text>Start time: {moment(jobData.arrival_window_start).format('h:mm A')} </Text>
						<Text>Distance to location: {this.props.distance} </Text>
					</View>
				</CardSection>
			</View>
		);
	}

	render() {
		return this.renderContent(this.props.jobData);
	}
}

const mapStateToProps = state => {
	let {jobData, loading} = state.job;
	let {distance} = state.map;

	return {jobData, loading, distance};
};

export default connect(mapStateToProps, {accept, getFirst, cancel, nextStatus})(JobDetails);
