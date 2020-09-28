import React, { useState, useEffect } from 'react'
import { Text, Animated } from 'react-native';
import { styles } from './styles';

type IProps = {
    visible: Boolean,
    message: String,
    containerStyle: Object
};

// let timerID = null;

export const Toast = (props: IProps) => {
    const {
        visible = false,
        message,
        containerStyle
    } = props;

    let timerID = null;

    useEffect(() => {
        return () => {
            timerID && clearTimeout(timerID);
        };
    });

    const animateOpacityValue = new Animated.Value(0);

    const showToastFunction = (duration = 1000) => {
        Animated.timing(
            animateOpacityValue,
            {
                toValue: 0.8,
                duration: 200,
            }
        ).start(hideToastFunction(duration));
    };

    const hideToastFunction = (duration) => {
        timerID = setTimeout(() => {
            Animated.timing(
                animateOpacityValue,
                {
                    toValue: 0,
                    duration: 200,
                }
            ).start(() => clearTimeout(timerID));
        }, duration);
    };

    visible && showToastFunction();

    if (visible) {
        return (
            <Animated.View
                style={[
                    styles.animatedToastView,
                    { opacity: animateOpacityValue },
                    containerStyle && containerStyle
                ]}
            >

                <Text
                    numberOfLines={2}
                    style={styles.title}
                >
                    {message}
                </Text>

            </Animated.View>
        );
    }
    else {
        return null;
    }
}

export default Toast
