
// @flow

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';
import { colors } from '~/styles/colors';
import { Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { AssetImage } from '../AssetImage';
import { BUTTON_TYPE, BUTTON_COLOR } from '~/api/consts/core';

type IProps = {
    children: any,
    onPress: Function,
    loading: boolean,
    disabled: boolean,
    whiteButton: boolean,
    style: Object,
    iconPlacement: any,
    btnTitle: String,
    type: String,
    iconName: String,
    imageIcon: Boolean,
    isGradient: Boolean,
    raised: Boolean,
    imageSource: String | any,
    buttonType: String,
    containerStyle: Object,
};

export const CtGradientButton = (props: IProps) => {
    const {
        style,
        iconPlacement,
        type = "solid",
        loading = false,
        btnTitle,
        iconName,
        imageIcon = false,
        imageSource,
        raised,
        buttonColor = BUTTON_COLOR.PRIMARY,
        containerStyle,
        buttonContainerStyle,
        hasFocus = true,
        onPress,
    } = props;

    const [buttonFocus, setButtonFocus] = useState(false);

    useEffect(() => {
        if (!loading && buttonFocus) {
            setButtonFocus(false);
        }
    }, [loading, buttonFocus]);

    const onBtnPress = () => {
        setButtonFocus(true);

        onPress && onPress();
    }

    return (
        <View style={[styles.buttonContainer, buttonContainerStyle]}>
            <Button
                icon={
                    imageIcon ? (
                        <AssetImage imageSource={imageSource} imageStyle={styles.imageIcon} />
                    ) : (
                            <Icon name={iconName} size={15} color={colors.white} />
                        )
                }
                {...iconPlacement}
                containerStyle={[
                    styles.containerStyle,
                    raised && styles.containerShadow,
                    containerStyle && containerStyle,
                    hasFocus && buttonFocus && { borderColor: colors[`${buttonColor}Light`] }
                ]}
                buttonStyle={[
                    styles.buttonStyle,
                    style,
                    type === BUTTON_TYPE.OUTLINE ?
                        [{ borderColor: colors[buttonColor] }, styles.buttonOutline] :
                        {
                            backgroundColor: colors[buttonColor],
                            borderColor: colors[buttonColor]
                        },
                ]}
                onPress={onBtnPress}
                type={type}
                title={btnTitle}
                titleStyle={[
                    styles.titleStyle,
                    type === BUTTON_TYPE.OUTLINE && { color: colors[buttonColor] }
                ]}
                loading={loading && buttonFocus}
                loadingStyle={{ opacity: 0.7 }}
                loadingProps={{ color: colors.darkGray }}
                linearGradientProps={{
                    colors: [colors.primary, colors.primaryLight],
                    start: { x: 0, y: 0.5 },
                    end: { x: 1, y: 0.5 },
                }}
                disabled={loading}
                disabledStyle={[
                    styles.buttonStyle,
                    style,
                    type === BUTTON_TYPE.OUTLINE ?
                        [{ borderColor: colors[buttonColor] }, styles.buttonOutline] :
                        {
                            backgroundColor: colors[buttonColor],
                            borderColor: colors[buttonColor],
                            opacity: 0.7,
                        },
                ]}
                disabledTitleStyle={
                    styles.titleStyle,
                    {
                        color: (type === BUTTON_TYPE.OUTLINE) ?
                            colors[buttonColor] : colors.white,
                    }
                }
                ViewComponent={LinearGradient}
            />
        </View>
    );
}




export const CtButton = (props: IProps) => {
    const {
        style,
        iconPlacement,
        type = "solid",
        loading = false,
        btnTitle,
        iconName,
        imageIcon = false,
        imageSource,
        raised,
        buttonColor = BUTTON_COLOR.PRIMARY,
        containerStyle,
        buttonContainerStyle,
        hasFocus = true,
        onPress,
    } = props;

    const [buttonFocus, setButtonFocus] = useState(false);

    useEffect(() => {
        if (!loading && buttonFocus) {
            setButtonFocus(false);
        }
    }, [loading, buttonFocus]);

    const onBtnPress = () => {
        setButtonFocus(true);

        onPress && onPress();
    }

    return (
        <View style={[styles.buttonContainer, buttonContainerStyle]}>
            <Button
                icon={
                    imageIcon ? (
                        <AssetImage imageSource={imageSource} imageStyle={styles.imageIcon} />
                    ) : (
                            <Icon name={iconName} size={15} color={colors.white} />
                        )
                }
                {...iconPlacement}
                containerStyle={[
                    styles.containerStyle,
                    raised && styles.containerShadow,
                    containerStyle && containerStyle,
                    hasFocus && buttonFocus && { borderColor: colors[`${buttonColor}Light`] }
                ]}
                buttonStyle={[
                    styles.buttonStyle,
                    style,
                    type === BUTTON_TYPE.OUTLINE ?
                        [{ borderColor: colors[buttonColor] }, styles.buttonOutline] :
                        {
                            backgroundColor: colors[buttonColor],
                            borderColor: colors[buttonColor]
                        },
                ]}
                onPress={onBtnPress}
                type={type}
                title={btnTitle}
                loading={loading && buttonFocus}
                loadingStyle={{ opacity: 0.7 }}
                loadingProps={{ color: colors.darkGray }}
                titleStyle={[
                    styles.titleStyle,
                    type === BUTTON_TYPE.OUTLINE && { color: colors[buttonColor] }
                ]}
                disabled={loading}
                disabledStyle={[
                    styles.buttonStyle,
                    style,
                    type === BUTTON_TYPE.OUTLINE ?
                        [{ borderColor: colors[buttonColor] }, styles.buttonOutline] :
                        {
                            backgroundColor: colors[buttonColor],
                            borderColor: colors[buttonColor],
                            opacity: 0.7,
                        },
                ]}
                disabledTitleStyle={
                    styles.titleStyle,
                    {
                        color: (type === BUTTON_TYPE.OUTLINE) ?
                            colors[buttonColor] : colors.white,
                    }
                }
            />
        </View>
    );
}
