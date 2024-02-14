import React from 'react';
import {View} from 'react-native';

const Section = (props) => {
    return (
        <View style={styles.containerStyle}>
            {props.children}
        </View>
    );
};

const styles = {
    containerStyle: {
        padding: 20,
        flexDirection: 'row'
    }
};


export {Section};
