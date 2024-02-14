import React from 'react';
import {Text} from 'react-native';
import Colors from "./Colors";

const ErrorText = (props) => (<Text style={styles.errorTextStyle}>{props.children}</Text>);

const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: Colors.error,
        position: 'absolute',
        top: 20
    }
};

export {ErrorText};
