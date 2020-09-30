import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { FakeInput } from '../FakeInput';
import { styles } from './styles';

type IProps = {
    input: Object,
    disabled: Boolean,
    fakeInputContainerStyle: Object,
    hint: String,
    initialValue: string,
    onChangeCallback: Function
};
export const RadioButtonGroup = (props: IProps) => {
    const {
        input: { onChange },
        onChangeCallback,
        options,
        hint
    } = props;

    const [selected, setSelected] = useState(options[0].key);

    const onSelect = (val) => {
        onChange(val);

        onChangeCallback && onChangeCallback(val);

        setSelected(val);
    };

    return (
        <View style={styles.fieldContainer}>
            {hint && (
                <Text style={styles.hintStyle}>{hint}</Text>
            )}
            <View>
                {options.map(item => (
                    <TouchableOpacity
                        key={item.key} style={styles.buttonContainer}
                        onPress={() => onSelect(item.key)}
                    >
                        <View
                            style={[
                                styles.circle,
                                selected === item.key && styles.checkedCircle
                            ]}
                        >
                            <View style={styles.middleCircle} />
                        </View>
                        <Text style={[styles.label, selected === item.key && styles.checkedLabel]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
