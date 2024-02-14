import React, {Component} from 'react';
import {
	Image,
	StyleSheet,
	TouchableHighlight,
	View,
	Text,
	Keyboard,
	ActionSheetIOS,
	TouchableOpacity,
	AlertIOS,
	Modal,
	Alert
} from 'react-native';
import {connect} from 'react-redux';
import {Button, Input, Card, CardSection, CardHeader, ErrorText} from "./common/";
import {
	getFirst,
	getActive,
	accept,
	cancel,
	nextStatus,
	finishEstimate,
	sendPhotos,
	resetError
} from "../actions/job/index";
import ImagePicker from "react-native-image-picker";
import {RowDivider} from "./common/RowDivider";

const Permissions = require('react-native-permissions');

class Estimate extends Component {
	constructor(props) {
		super(props);
	}

	state = {
		image: null,
		description: '',
		imgListArrState: [],
		imgListArr: null,
		clicked: null,
		imageUploadErrors: [],
		modalVisible: false,
		estimatedHours: null,
		error: null,
	};

	onSetEstimatedHours(estimatedHours) {
		let cleanString = '';
		let numbers = '0123456789';
		let estimatedHoursArray = estimatedHours.split("");
		let sum = 0;
		if (estimatedHoursArray.length > 0) {
			sum = estimatedHoursArray.reduce(function (accumulator, currentValue) {
				let accumulatorInt = parseInt(accumulator, 10);
				let currentValueInt = parseInt(currentValue, 10);
				return accumulatorInt + currentValueInt;
			});
		}
		for (let i = 0; i < estimatedHours.length; i++) {
			if (numbers.indexOf(estimatedHours[i]) > -1 && sum > 0) {
				cleanString = cleanString + estimatedHours[i];
			}
		}
		this.setState({estimatedHours: cleanString});
		this.setState({error: false});

	}

	setModalVisible(modalVisible) {
		this.setState({modalVisible});
		this.setState({description: null});
	}

	pickImage = async () => {
		console.log('this.state.photoPermission', this.state.photoPermission);
		let result = await ImagePicker.launchImageLibrary({}, (result) => {
			console.log('launchImageLibrary result', result);
			if (!result.didCancel && !result.error && this.state.photoPermission !== 'undefined' && this.state.photoPermission !== 'undetermined') {
				this.setState({image: result.uri});
				this.setModalVisible(!this.state.modalVisible);
			}
		});
		console.log('pick image result after: ' + JSON.stringify(result));
	};
	takePhoto = async () => {
		console.log('this.state.cameraPermission', this.state.cameraPermission);
		let result = await ImagePicker.launchCamera({}, (result) => {
			console.log('launchCamera result', result);
			if (!result.didCancel && !result.error && this.state.cameraPermission !== 'undefined' && this.state.cameraPermission !== 'undetermined') {
				this.setState({image: result.uri});
				this.setModalVisible(!this.state.modalVisible);
			}
		});
		console.log('result of taking photo: ' + JSON.stringify(result));
	};

	onPickImage() {
		this.props.resetError();
		Permissions.check('photo')
			.then(response => {
				this.setState({photoPermission: response});
				//response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
				if (this.state.photoPermission === 'denied') {
					this._alertForPhotosPermission();
				} else {
					this.pickImage();
				}
			});
	}

	onTakePhoto() {
		this.props.resetError();
		Permissions.check('camera')
			.then(response => {
				this.setState({cameraPermission: response});
				//response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
				if (this.state.cameraPermission === 'denied') {
					this._alertForCameraPermission();
				} else {
					this.takePhoto();
				}
			});
	}

	_requestPermissionPhoto() {
		Permissions.request('photo')
			.then(response => {
				this.setState({photoPermission: response})
			});
	}

	_requestPermissionCamera() {
		Permissions.request('camera')
			.then(response => {
				this.setState({cameraPermission: response})
			});
	}

	_alertForPhotosPermission() {
		AlertIOS.alert(
			`Can we access your photos?`,
			'We need access so you can send photos from library',
			[
				{text: 'No', onPress: () => console.log('permission denied for photos'), style: 'cancel'},
				this.state.type === 'undetermined' ?
					{text: 'OK', onPress: () => this._requestPermissionPhoto()}
					: {text: 'Open Settings', onPress: Permissions.openSettings}
			]
		)
	}

	_alertForCameraPermission() {
		AlertIOS.alert(
			`Can we access your camera?`,
			'We need access so you can take photos and send them',
			[
				{text: 'No', onPress: () => console.log('permission denied for camera'), style: 'cancel'},
				this.state.type === 'undetermined' ?
					{text: 'OK', onPress: () => this._requestPermissionCamera()}
					: {text: 'Open Settings', onPress: Permissions.openSettings}
			]
		)
	}

	onFinishEstimate = async () => {
		this.props.resetError();
		let imgListArrStateSliced = this.state.imgListArrState.slice();
		let parent = this;
		if (!this.state.estimatedHours && this.props.type === 1) {
			this.setState({error: true});
		} else if (this.props.type === 2) {
			parent.props.sendPhotos(imgListArrStateSliced, parent.props.jobData, parent.props.token, parent.props.type);
		} else {
			parent.props.finishEstimate(imgListArrStateSliced, parent.props, parent.state.estimatedHours);
		}
	};
	addImage = () => {
		if (this.state.image !== null && this.state.imgListArrState) {
			let imgListArrStateSliced = this.state.imgListArrState.slice();
			imgListArrStateSliced.push(
				{
					description: this.state.description,
					imgSrc: {url: this.state.image}
				}
			);
			this.setState({imgListArrState: imgListArrStateSliced});
			this.setState({image: null});
			this.setState({description: null});
		}
		this.setModalVisible(!this.state.modalVisible);
	};

	editImage(index) {
		ActionSheetIOS.showActionSheetWithOptions({
				options: [
					'Remove',
					'Cancel',
				],
				cancelButtonIndex: 4,
				destructiveButtonIndex: 2,
			},
			(buttonIndex) => {
				switch (buttonIndex) {
					case 0:
						let imgListArrStateSliced = this.state.imgListArrState.slice();
						imgListArrStateSliced.splice(index, 1);
						this.setState({imgListArrState: imgListArrStateSliced});
				}
			});
	}

	renderError() {
		return this.props.error
			? <ErrorText style={styles.errorTextStyle}>{this.props.error}</ErrorText>
			: null;
	}

	renderContent() {
		let {image} = this.state;

		return (
			<View>
				<Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalVisible}>
					<View style={styles.modalWrapper}>
						<CardSection>
							{image &&
							<Image source={{uri: image}} style={styles.image}/>}
						</CardSection>
						<CardSection>
							<Input
								label="Description"
								placeholder="Description"
								onChangeText={(description) => this.setState({description})}
								value={this.state.description}
								onSubmitEditing={Keyboard.dismiss}/>
						</CardSection>
						<CardSection>
							<Button onPress={this.addImage}>Add</Button>
						</CardSection>
						<CardSection addedStyle={{justifyContent: 'center'}}>
							<TouchableOpacity
								onPress={() => {
									this.setModalVisible(!this.state.modalVisible)
								}}>
								<Text>Close</Text>
							</TouchableOpacity>
						</CardSection>
					</View>
				</Modal>

				<Card>
					<CardSection>
						<CardHeader>{this.props.children}</CardHeader>
					</CardSection>
					<CardSection>
						<View style={{flexDirection: 'column'}}>
							<View style={styles.imagesContainer}>
								{this.state.imgListArrState.map((obj, index) => (
									<View style={{flexDirection: 'column', alignItems: 'center'}} key={index}>
										<TouchableOpacity onPress={() => this.editImage(index)}>
											<Image style={styles.imageThumb} source={obj.imgSrc}/>
										</TouchableOpacity>
										<Text>{obj.description}</Text>
									</View>
								))}
							</View>
						</View>
					</CardSection>
					<CardSection>
						{this.renderError()}
					</CardSection>
					<CardSection>
						<Button onPress={() => this.onTakePhoto()} iconName="ios-camera"/>
						<RowDivider size={0.1}/>
						<Button onPress={() => this.onPickImage()} iconName="ios-images"/>
					</CardSection>
					{this.props.type === 1 &&
					<CardSection>
						<Input
							label="Estimated time *"
							placeholder="Hours"
							keyboardType="numeric"
							onChangeText={(estimatedHours) => this.onSetEstimatedHours(estimatedHours)}
							value={this.state.estimatedHours}
							error={this.state.error}
						/>
					</CardSection>}
					<CardSection>
						<Button onPress={this.onFinishEstimate.bind(this)}>Finish and send</Button>
					</CardSection>
				</Card>
			</View>
		);
	}

	render() {
		return this.renderContent();
	}
}

const styles = StyleSheet.create({
	modalWrapper: {
		flex: 1,
		marginTop: 20,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		width: 320
	},
	imagesContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		padding: 0,
	},
	imageThumb: {
		width: 60,
		height: 60,
		margin: 10,
	},
	image: {
		width: 200,
		height: 200,
		margin: 10,
	},
});

const mapStateToProps = state => {
	let {token} = state.auth;
	let {jobData, loading, timeEstimate, error} = state.job;

	return {token, jobData, loading, timeEstimate, error};
};

export default connect(mapStateToProps, {
	accept,
	getFirst,
	getActive,
	cancel,
	nextStatus,
	finishEstimate,
	sendPhotos,
	resetError,
})(Estimate);