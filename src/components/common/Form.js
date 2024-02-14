import React from 'react';
import {View} from 'react-native'

const Form = (props) => {
    return (
        <View style={styles.containerStyle}>
            {props.children}
        </View>
    );
};

const styles = {
    containerStyle: {
        padding: 30,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
};

export {Form};
