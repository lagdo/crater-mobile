// @flow

import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { styles } from './styles';
import { InputField, CtHeader, CtDivider } from '../..';
import { Content } from '../../Content';
import Lng from '../../../api/lang/i18n';

type IProps = {
    children: Object,
    headerProps: Object,
    onSearch: Function,
    bottomDivider: Boolean,
    hasSearchField: Boolean,
    onToggleFilter: Function,
    filterProps: Object,
    inputProps: Object,
    dividerStyle: Object,
    loadingProps: Object
};

const MainLayoutComponent = ({
    children,
    headerProps,
    onSearch,
    bottomDivider,
    hasSearchField = true,
    onFocus,
    bottomAction,
    filterProps,
    inputProps,
    dividerStyle,
    loadingProps,
    language
}: IProps) => {

    let hasFilter = filterProps ? { ...filterProps } : null

    return (
        <View style={styles.page}>
            <View style={styles.content}>
                <CtHeader
                    titleStyle={styles.headerTitleStyle}
                    placement="left"
                    transparent
                    noBorder
                    hasCircle
                    {...headerProps}
                    filterProps={hasFilter}
                />

                {hasSearchField && (
                    <View style={styles.searchFieldContainer}>
                        <Field
                            name="search"
                            component={InputField}
                            inputProps={{
                                returnKeyType: 'next',
                                autoCapitalize: 'none',
                                placeholder: Lng.t("search.title"),
                                autoCorrect: true,
                                ...inputProps
                            }}
                            onChangeText={onSearch}
                            height={40}
                            rounded
                            fieldStyle={styles.inputField}
                        />
                    </View>
                )}

                {bottomDivider &&
                    <CtDivider dividerStyle={dividerStyle && dividerStyle} />
                }

                <Content loadingProps={loadingProps}>
                    {children}
                </Content>

            </View>

            {bottomAction && (
                <View style={styles.bottomView}>
                    {bottomAction}
                </View>
            )}
        </View>
    );
};

const mapStateToProps = ({ global }) => ({
    language: global.language,
});

const mapDispatchToProps = {};

//  connect
export const MainLayout = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MainLayoutComponent);
