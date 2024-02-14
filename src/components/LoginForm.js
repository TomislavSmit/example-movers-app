import React, {Component} from 'react';
import {
	KeyboardAvoidingView,
	Keyboard,
	View
} from 'react-native';
import {Button, Form, Section, Input, Spinner, ErrorText} from "./common";
import {connect} from 'react-redux';
import {emailChanged, passwordChanged, login} from "../actions/auth/index";

class LoginForm extends Component {
	onEmailChange(text) {
		this.props.emailChanged(text);
	}

	onPasswordChange(text) {
		this.props.passwordChanged(text);
	}

	onLogIn() {
		const {email, password} = this.props;
		this.props.login({email, password});
	}

	renderError() {
		return this.props.error ? <ErrorText style={styles.errorTextStyle}>{this.props.error}</ErrorText> : null;
	}

	renderContent() {
		if (this.props.loading) {
			return <Spinner/>
		}

		return (
			<Form>
				<View style={{ width: 320, paddingTop: 40 }}>
					{this.renderError()}
					<Section>
						<Input
							label="Email"
							placeholder="email@email.com"
							onChangeText={this.onEmailChange.bind(this)}
							value={this.props.email}
							keyboardType="email-address"
						/>
					</Section>
					<Section>
						<Input
							secureTextEntry
							label="Password"
							placeholder="password"
							onChangeText={this.onPasswordChange.bind(this)}
							value={this.props.password}
						/>
					</Section>
					<Section>
						<Button onPress={this.onLogIn.bind(this)}>
							Login
						</Button>
					</Section>
				</View>
			</Form>
		);
	}

	render() {
		return this.renderContent();
	}
}

const styles = {
	errorTextStyle: {
		fontSize: 20,
		alignSelf: 'center',
		color: 'red'
	}
};

const mapStateToProps = state => {
	let {email, password, error, loading} = state.auth;

	return {email, password, error, loading};
};

export default connect(mapStateToProps, {emailChanged, passwordChanged, login})(LoginForm);
