import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Colors from "./common/Colors";

class Timer extends Component {
	state = {
		timer: '00:00:00',
		secondsElapsed: this.props.jobData.time,
		intervalId: null,
	};

	componentDidMount() {
		this.setState({timer: moment.utc(this.state.secondsElapsed * 1000).format("HH:mm:ss")});
		if (this.props.jobData.is_timer_running) {
			this.setState({intervalId: setInterval(this.tick, 1000)});
		} else {
			clearInterval(this.state.intervalId);
		}
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}

	tick = () => {
		this.setState({secondsElapsed: this.state.secondsElapsed + 1});
		this.setState({timer: moment.utc(this.state.secondsElapsed * 1000).format("HH:mm:ss")});
	};

	render() {
		return (
			<Text
				style={this.props.jobData.is_timer_running
					? styles.timer
					: styles.timerPaused}>
				{this.state.timer}
			</Text>
		)
	}
}

const mapStateToProps = state => {
	let {jobData} = state.job;

	return {jobData};
};

const styles = StyleSheet.create({
	timer: {
		fontSize: 24,
		fontWeight: 'bold',
		padding: 20
	},
	timerPaused: {
		fontSize: 24,
		fontWeight: 'bold',
		color: Colors.tabIconDefault,
		padding: 20,
	}
});

export default connect(mapStateToProps)(Timer);