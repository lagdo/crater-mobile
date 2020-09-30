import React, { useState } from 'react';
import { Switch, View, Text } from 'react-native';
import { colors } from '../../styles/colors';
import { styles } from './styles';

type IProps = {
    input: Object,
    disabled: Boolean,
    meta: Object,
    switchStyle: Object,
    containerStyle: Object,
    descriptionStyle: Object,
    hintStyle: Object,
    hint: string,
    description: String,
    switchType: String,
};
export const ToggleSwitch = (props: IProps) => {
    const {
        switchType,
        hint,
        description,
        containerStyle,
        mainContainerStyle,
        hintStyle,
        descriptionStyle,
        input: { value, onChange },
        status,
        switchStyle,
        onChangeCallback,
    } = props;

    // const [loading, setLoading] = useState(false);
    const statusValue = status !== undefined ? status : value ? true : false;
    const [currencyStatus, setCurrencyStatus] = useState(statusValue);

    const onToggle = () => {
        setCurrencyStatus(!currencyStatus);

        onChange(!currencyStatus);

        onChangeCallback && onChangeCallback(!currencyStatus);
    };

    return (
        <View style={[
            styles.mainContainer,
            mainContainerStyle && mainContainerStyle
        ]}
        >
            <View
                style={[
                    styles.container,
                    containerStyle && containerStyle
                ]}
            >
                {
                    hint && (
                        <Text
                            numberOfLines={2}
                            style={[styles.hint, hintStyle && hintStyle]}
                        >
                            {hint}
                        </Text>
                    )
                }
                <Switch
                    ios_backgroundColor={colors.darkGray}
                    thumbColor={colors.white}
                    trackColor={{ false: colors.darkGray, true: colors.primaryLight }}
                    onValueChange={onToggle}
                    value={currencyStatus}

                    style={[
                        styles.switchStyle,
                        switchStyle && switchStyle
                    ]}
                />
            </View>
            {
                description && (
                    <View style={styles.descriptionContainer}>
                        <Text
                            style={[styles.description,
                            descriptionStyle && descriptionStyle]}
                        >
                            {description}
                        </Text>
                    </View>
                )
            }
        </View>
    );
}

export default ToggleSwitch;
