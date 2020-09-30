import React, { useState } from 'react';
import { TouchableOpacity, View, StatusBar } from 'react-native';
import ActionSheet from 'react-native-actionsheet'
import { styles } from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../styles/colors';

type IProps = {
    options: Array,
    onPress: Function,
    cancelButtonIndex: Number,
    destructiveButtonIndex: Number,
};

export default Dropdown = (props: IProps) => {
    const {
        options,
        onPress,
        onSelect,
        cancelButtonIndex = 2,
        destructiveButtonIndex = 1,
    } = props;

    const labelOptions = [...options, { label: 'Cancel', value: null }].map(
        ({ label }) => label,
    );
    let actionSheet = null;

    // const [labelOptions, setLabelOptions] = useState([]);
    const [visible, setVisible] = useState(false);

    const onToggleStatus = () => setVisible(!visible);

    const showActionSheet = () => {
        onToggleStatus();
        actionSheet && actionSheet.show();
    };

    const onItemSelected = (index) => {
        onToggleStatus()

        const valueOptions = [...options, { label: 'Cancel', value: null }].map(
            ({ value }) => value,
        );

        onSelect && onSelect(valueOptions[index]);
    }

    return (
        <View>

            {visible && (
                <StatusBar
                    backgroundColor={colors.secondary}
                    barStyle={"dark-content"}
                    translucent={true}
                />
            )}

            <TouchableOpacity
                onPress={showActionSheet}
                style={styles.button}
                hitSlop={{
                    top: 13,
                    left: 13,
                    bottom: 13,
                    right: 13
                }}
            >
                <Icon
                    name={'ellipsis-h'}
                    size={18}
                    style={styles.iconStyle}
                />
            </TouchableOpacity>

            {labelOptions && (
                <ActionSheet
                    ref={sheet => actionSheet = sheet}
                    tintColor={colors.primary}
                    options={labelOptions}
                    cancelButtonIndex={cancelButtonIndex}
                    destructiveButtonIndex={destructiveButtonIndex}
                    onPress={onItemSelected}
                />
            )}
        </View>
    );
}
