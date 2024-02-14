import React from 'react';
import {Text, View} from 'react-native';

const CardHeader = (props) => {
    const {containerStyle, textStyle} = styles;
    return (
        <View style={containerStyle}>
            <Text style={textStyle}>{props.children}</Text>
        </View>
    );
};

const styles = {
    containerStyle: {
        flex: 1,
        alignItems:'center',
        flexDirection: 'column'
    },
    textStyle: {
        fontSize: 22,
        justifyContent: 'center',
        alignContent: 'center'
    }
};

export {CardHeader};
