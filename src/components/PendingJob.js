import React, {Component} from 'react';
import {Text, View, AsyncStorage, Alert} from "react-native";
import Pusher from 'pusher-js/react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import config from "../config";
import {Button, Card, CardSection, CardHeader, RowDivider, Spinner} from "./common";
import {getFirst, accept, ignore} from "../actions/job";

class PendingJob extends Component {
	state = {
		// TODO: Move Pusher instance to a separate function
		pusher: new Pusher(config.pusher.appKey, {
			cluster: 'eu',
			encrypted: true
		}),
	};

	componentDidMount() {
		this.subscribeToJobs();
		AsyncStorage.getItem('ignoredJobs')
			.then((ignoredJobs) => {
				this.props.getFirst(this.props.token, ignoredJobs);
			});
	};

	subscribeToJobs() {
		let channel = this.state.pusher.subscribe('jobs');
		let parent = this;
		channel.bind('created', function () {
			parent.checkAlert(parent);
		});
		channel.bind('accepted', function (data) {
			console.log('data on accepted: ', data);
			if (parent.props.jobData.id === data.id) {
				alert("Someone accepted this job");
				parent.props.ignore();
			}
		});
	}

	checkAlert(parent) {
		console.log('alertPresent: ', this.alertPresent);
		if (!this.alertPresent) {
			this.alertPresent = true;
			Alert.alert("", "Received pending job", [{text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
			AsyncStorage.getItem('ignoredJobs')
				.then((ignoredJobs) => {
					parent.props.getFirst(parent.props.token, ignoredJobs);
				});
		}
	}

	onAccept() {
		if (!this.props.jobData) return false;
		this.state.pusher.unsubscribe('jobs');
		this.props.accept(this.props.jobData.id, this.props.token);
	}

	onIgnore() {
		if (!this.props.jobData) return false;

		let jobId = this.props.jobData.id.toString();
		AsyncStorage.getItem('ignoredJobs')
			.then((value) => {
				if (value !== null) {
					AsyncStorage.setItem('ignoredJobs', jobId + ',' + value);
				} else {
					AsyncStorage.setItem('ignoredJobs', jobId);
				}
			})
			.catch((error) => {
				console.warn("Error getting ignored jobs: ", error);
			});
		this.props.ignore(this.props.jobData.id);
	}

	addressTypes = {pickup: 1, delivery: 2};

	address(jobData, type) {
		return jobData.route.addresses.reduce((sum = {}, address) => {
			return address.type === this.addressTypes[type] ? address : sum;
		});
	}

	renderContent(jobData) {
		if (this.props.loading) {
			return <Spinner/>
		}

		if (!jobData) {
			return (
				<Card>
					<CardSection>
						<Text>No pending jobs</Text>
					</CardSection>
				</Card>
			);
		}

		return (
			<Card>
				<CardSection>
					<CardHeader>New Move Request</CardHeader>
				</CardSection>
				<CardSection>
					<View style={{flexDirection: 'column'}}>
						<Text>Id: {jobData.id} </Text>
						<Text>Pickup: {this.address(jobData, "pickup").full_address} </Text>
						<Text>Delivery: {this.address(jobData, "delivery").full_address} </Text>
						<Text>Size: {this.address(jobData, "pickup").size.name} </Text>
						<Text>Price: {jobData.max_price} </Text>
						<Text>Start time: {moment(jobData.arrival_window_start).format('h:mm A')} </Text>
						<Text>Distance to pickup location: {this.props.distance} </Text>
					</View>
				</CardSection>
				<CardSection>
					<Button
						onPress={this.onAccept.bind(this)}>
						Accept job
					</Button>
					<RowDivider size={0.1}/>
					<Button
						onPress={this.onIgnore.bind(this)}>
						Ignore job
					</Button>
				</CardSection>
			</Card>
		);

	}

	render() {
		return (
			<View>
				{this.renderContent(this.props.jobData)}
			</View>
		);
	}
}

const mapStateToProps = state => {
	let {token} = state.auth;
	let {jobData, loading} = state.job;
	let {distance} = state.map;

	return {token, jobData, loading, distance};
};

export default connect(mapStateToProps, {accept, getFirst, ignore})(PendingJob);
