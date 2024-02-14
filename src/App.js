import React, {Component} from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import Application from "./components/Application";
import './ReactotronConfig';
import Reactotron from 'reactotron-react-native';

export default class App extends Component {
	render() {
		return (
			<Provider store={Reactotron.createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
				<Application/>
			</Provider>
		);
	}
}
