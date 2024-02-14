import React, {Component} from 'react';
import {Text, View, AsyncStorage, Alert, KeyboardAvoidingView} from "react-native";
import {connect} from 'react-redux';
import Pusher from 'pusher-js/react-native';
import {getFirst, getActive, accept, cancel, nextStatus, pause} from "../actions/job/index";
import constants from "../constants";
import config from "../config";

import {Button, Card, CardSection, Spinner, RowDivider} from "./common/";
import JobDetails from "./JobDetails";
import Estimate from "./Estimate";
import Timer from "./Timer";
import BroadcastLocation from './BroadcastLocation';
import openMap from 'react-native-open-maps';
import CustomerDetails from "./CustomerDetails";

class ActiveJob extends Component {
	state = {
		// TODO: Move Pusher instance to a separate function
		pusher: new Pusher(config.pusher.appKey, {
			cluster: 'eu',
			encrypted: true
		}),
	};

	componentDidMount() {
		this.subscribeToJob(this.props.jobData.id);
	};

	subscribeToJob(id) {
		let channel = this.state.pusher.subscribe('job_' + id);
		let parent = this;
		channel.bind('updated', function () {
			console.log("Received updated event");
			parent.props.getActive(parent.props.token);
		});
	}

	onPause() {
		this.props.pause(this.props.token);
	}

	onNext() {
		this.props.nextStatus(this.props.token);
	}

	onCancel() {
		Alert.alert(
			'Cancel Job',
			'Are you sure you want to cancel this job?',
			[
				{text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
				{text: 'Yes', onPress: () => cancelAction()},
			]
		);
		let cancelAction = () => {
			this.props.cancel(this.props.jobData.id, this.props.token);
			let jobId = this.props.jobData.id.toString();
			AsyncStorage.getItem('ignoredJobs')
				.then((value) => {
					if (value !== null) {
						AsyncStorage.setItem('ignoredJobs', jobId + ',' + value);
					} else {
						AsyncStorage.setItem('ignoredJobs', jobId);
					}
					console.log('ignored jobs: ', value, jobId);
				})
				.catch((error) => {
					console.warn("Error getting ignored jobs: ", error);
				});
		}
	}

	onConfirm() {
		console.log('Confirmed!');
	}

	goToDestination() {
		openMap({
			latitude: this.props.destination.latitude,
			longitude: this.props.destination.longitude,
			provider: 'google'
		});
	};

	renderContent(jobData) {
		if (this.props.error) return <Text>{this.props.error}</Text>;

		if (!jobData) return <Text>Error with job data. Please try refreshing the application.</Text>;

		switch (jobData.status.toString()) {
			case constants.STATUS_ACCEPTED:
				return (
					<Card>
						<CustomerDetails/>
						<JobDetails/>
						<CardSection>
							<Button onPress={this.onNext.bind(this)}>Start job</Button>
							<RowDivider size={0.1}/>
							<Button onPress={this.onCancel.bind(this)}>Cancel job</Button>
						</CardSection>
					</Card>
				);
			case constants.STATUS_PICKUP_ARRIVING:
				return (
					<Card>
						<JobDetails/>
						<CardSection>
							<Button onPress={this.onNext.bind(this)}>Arrived at pickup location</Button>
						</CardSection>
						<CardSection>
							<Button onPress={this.goToDestination.bind(this)}>Open Map</Button>
						</CardSection>
					</Card>
				);
			case constants.STATUS_PICKUP_ARRIVED:
				return (
					<Card>
						<JobDetails/>
						<CardSection>
							<Button onPress={this.onNext.bind(this)}>Start estimating</Button>
						</CardSection>
					</Card>
				);
			case constants.STATUS_PICKUP_ESTIMATE:
				return (
					<Card>
						<Estimate type={1}>
							<Text>Pickup estimate</Text>
						</Estimate>
					</Card>
				);
			case constants.STATUS_PICKUP_ESTIMATED:
				return (
					<Card>
						<JobDetails/>
						<CardSection addedStyle={{flexDirection: 'column'}}>
							<Text style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'center'}}>
								Waiting for customer to approve...
							</Text>
						</CardSection>
						<CardSection addedStyle={{alignSelf: 'center'}}>
							<Spinner addedStyle={{position: 'relative'}}/>
						</CardSection>
					</Card>
				);
			case constants.STATUS_APPROVED:
				return (
					<Card>
						<JobDetails/>
						<CardSection>
							<Button onPress={this.onNext.bind(this)}>Start loading</Button>
						</CardSection>
					</Card>
				);
			case constants.STATUS_PICKUP_LOADING:
				return (
					<Card>
						<JobDetails/>
						<CardSection>
							<Timer/>
						</CardSection>
						<CardSection>
							<Button onPress={this.onNext.bind(this)}>Finished loading</Button>
						</CardSection>
					</Card>
				);
			case constants.STATUS_PICKUP_LOADED:
				return (
					<Card>
						<JobDetails/>
						<CardSection>
							<Timer/>
						</CardSection>
						<CardSection>
							<Button onPress={this.onNext.bind(this)}>En route to delivery</Button>
						</CardSection>
					</Card>
				);
			case constants.STATUS_DELIVERY_ARRIVING:
				return (
					<Card>
						<JobDetails/>
						<CardSection>
							<Timer/>
						</CardSection>
						<CardSection>
							<Button onPress={this.onPause.bind(this)}>
								{this.props.jobData.is_timer_running ? 'Pause' : 'Unpause'}
							</Button>
							<RowDivider size={0.1}/>
							<Button disabled={!this.props.jobData.is_timer_running}
									onPress={this.onNext.bind(this)}>Arrived to delivery</Button>
						</CardSection>
						<CardSection>
							<Button onPress={this.goToDestination.bind(this)}>Open Map</Button>
						</CardSection>
					</Card>
				);
			case constants.STATUS_DELIVERY_ARRIVED:
				return (
					<Card>
						<JobDetails/>
						<CardSection>
							<Timer/>
						</CardSection>
						<CardSection>
							<Button onPress={this.onNext.bind(this)}>Start damage check</Button>
						</CardSection>
						<CardSection addedStyle={{alignSelf: 'center'}}>
							<Text>* Timer will be paused</Text>
						</CardSection>
					</Card>
				);
			case constants.STATUS_DELIVERY_ESTIMATE:
				return (
					<Card>
						<Estimate type={2}>
							<Text>Damage check</Text>
						</Estimate>
					</Card>
				);
			case constants.STATUS_DELIVERY_UNLOADING:
				return (
					<Card>
						<JobDetails/>
						<CardSection>
							<Timer/>
						</CardSection>
						<CardSection>
							<Button onPress={this.onNext.bind(this)}>Finish job</Button>
						</CardSection>
					</Card>
				);
			case constants.STATUS_DELIVERY_UNLOADED:
				return (
					<Card>
						<JobDetails/>
						<CardSection>
							<Timer/>
						</CardSection>
						<CardSection addedStyle={{flexDirection: 'column'}}>
							<Text style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'center'}}>
								Job completed. Customer will confirm and stop timer.
							</Text>
						</CardSection>
					</Card>
				);
			case constants.STATUS_COMPLETED:
				return (
					<Card>
						<JobDetails headerText="Job summary"/>
						<CardSection>
							<Timer/>
						</CardSection>
						<CardSection addedStyle={{flexDirection: 'column'}}>
							<Text style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'center'}}>
								Customer confirmed job completion.
							</Text>
						</CardSection>
					</Card>
				);
			case constants.STATUS_CANCELLED:
				return (
					<Card>
						<JobDetails/>
						<CardSection>
							<Timer/>
						</CardSection>
						<CardSection>
							<Button onPress={this.onConfirm.bind(this)}>Confirm</Button>
						</CardSection>
					</Card>
				);
			default:
				return (
					<Card>
						<CardSection>
							<Text>Found active job but error occured.</Text>
						</CardSection>
					</Card>
				);
		}
	}

	render() {
		return (
			<KeyboardAvoidingView behavior="padding">
				<BroadcastLocation/>
				{this.renderContent(this.props.jobData)}
			</KeyboardAvoidingView>
		);
	}
}

const mapStateToProps = state => {
	let {token} = state.auth;
	let {jobData, loading, destination, error} = state.job;

	return {token, jobData, loading, destination, error};
};

export default connect(mapStateToProps, {accept, getFirst, getActive, cancel, nextStatus, pause})(ActiveJob);
