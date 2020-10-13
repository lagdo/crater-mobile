// @flow

import React, { useEffect } from 'react';
import { View } from 'react-native';
import styles from './styles';
import { ListView, DefaultLayout } from '~/components';
import { ROUTES } from '~/navigation/routes';
import { colors } from '~/styles/colors';
import Lng from '~/api/lang/i18n';
import { CUSTOMIZES_MENU } from '../../constants';

export const Customizes = (props) =>  {
    const {
        navigation,
        getCustomizeSettings,
        getPaymentModes,
        getItemUnits,
        paymentModesLoading,
        itemUnitsLoading
    } = props;

    useEffect(() => {
        getCustomizeSettings()
        getPaymentModes()
        getItemUnits()
    }, []);

    const onSelectMenu = ({ route, type }) => {
        if (route) {
            navigation.navigate(route, { type })
        }
    }

    let loading = paymentModesLoading || itemUnitsLoading

    return (
        <View style={styles.container}>
            <DefaultLayout
                headerProps={{
                    leftIconPress: navigation.goBack,
                    title: Lng.t("header.customize"),
                    leftIconStyle: { color: colors.dark2 }
                }}
                hasSearchField={false}
                loadingProps={{ is: loading }}
            >
                <View style={styles.listViewContainer}>
                    <ListView
                        items={CUSTOMIZES_MENU()}
                        onPress={onSelectMenu}
                        leftTitleStyle={styles.listViewTitle}
                        listItemProps={{
                            chevron: {
                                size: 18,
                                color: colors.darkGray,
                                containerStyle: { marginTop: 5 }
                            },
                        }}
                    />
                </View>
            </DefaultLayout>
        </View>
    );
}
