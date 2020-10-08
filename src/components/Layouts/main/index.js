// @flow

import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
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
                    <Form onSubmit={() => {}}>
                    {() => (
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
                    </Form>
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

const mapStateToProps = ({ global: { language } }) => ({ language });

const mapDispatchToProps = {};

//  connect
export const MainLayout = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MainLayoutComponent);
