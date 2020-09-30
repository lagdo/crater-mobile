// @flow

import React, { useState, useEffect } from 'react';
import {
    TouchableWithoutFeedback,
    View
} from 'react-native';
import styles from './styles';
import { SlideModal, FakeInput, AssetImage, CtButton } from '../../../../components';
import { Icon } from 'react-native-elements';
import { colors } from '../../../../styles/colors';
import Lng from '../../../../api/lang/i18n';
import { headerTitle } from '../../../../api/helper';

type IProps = {
    label: String,
    icon: String,
    onChangeCallback: Function,
    placeholder: String,
    containerStyle: Object,
    rightIcon: String,
    leftIcon: String,
    color: String,
    value: String,
    templates: Array,
};

export const TemplateField = (props: IProps) => {
    const {
        navigation,
        containerStyle,
        templates,
        label,
        icon,
        placeholder,
        meta,
        onChangeCallback,
        input: { value, onChange },
    } = props;

    // const [page, setPage] = useState(1);
    const [visible, setVisible] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('');

    useEffect(() => {
        const template = templates.filter(val => val.id === value)[0]

        setSelectedTemplate(template);
    }, []);

    const onToggle = () => setVisible(!visible);

    const onSubmit = () => {
        onChange(selectedTemplate.id)

        onChangeCallback && onChangeCallback(selectedTemplate)

        onToggle()
    }

    const BOTTOM_ACTION = () => {
        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={onSubmit}
                    btnTitle={Lng.t("button.chooseTemplate")}
                />
            </View>
        )
    }

    const { name, id } = selectedTemplate;

    return (
        <View style={styles.container}>

            <FakeInput
                label={label}
                icon={icon}
                values={name}
                placeholder={placeholder}
                onChangeCallback={onToggle}
                containerStyle={containerStyle}
                meta={meta}
            />

            <SlideModal
                visible={visible}
                onToggle={onToggle}
                headerProps={{
                    leftIcon: "long-arrow-alt-left",
                    leftIconPress: onToggle,
                    title: Lng.t("header.template"),
                    titleStyle: headerTitle({ marginLeft: -19, marginRight: -19 }),
                    placement: "center",
                    hasCircle: false,
                    noBorder: false,
                    transparent: false,
                }}
                bottomDivider
                defaultLayout
                bottomAction={BOTTOM_ACTION()}
            >
                <View style={styles.imageList}>
                    {templates.map((val, index) => (
                        <TouchableWithoutFeedback
                            onPress={() => setSelectedTemplate(val)}
                            key={index}
                        >
                            <View style={styles.imageContainer}>
                                <AssetImage
                                    uri
                                    imageSource={val.path}
                                    imageStyle={[
                                        styles.image,
                                        id === val.id && styles.active
                                    ]}
                                />
                                {id === val.id &&
                                    <Icon
                                        name="check"
                                        size={18}
                                        iconStyle={styles.iconStyle}
                                        color={colors.white}
                                        containerStyle={styles.iconContainer}
                                    />
                                }
                            </View>
                        </TouchableWithoutFeedback>
                    ))}
                </View>
            </SlideModal>
        </View>
    );
}
