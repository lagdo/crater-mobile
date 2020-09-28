// @flow

import React, { useEffect } from 'react';
import { View } from 'react-native';
import styles from './styles';
import { ListView, DefaultLayout } from '../../../../components';
import { ROUTES } from '../../../../navigation/routes';
import { colors } from '../../../../styles/colors';
import Lng from '../../../../api/lang/i18n';
import { CUSTOMIZES_MENU } from '../../constants';
import { MOUNT, goBack, UNMOUNT } from '../../../../navigation/actions';

export const Customizes = (props) =>  {
    const {
        navigation,
        language,
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

        goBack(MOUNT, navigation);

        return () => goBack(UNMOUNT);
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
                    leftIconPress: () => navigation.navigate(ROUTES.SETTING_LIST),
                    title: Lng.t("header.customize", { locale: language }),
                    leftIconStyle: { color: colors.dark2 }
                }}
                hasSearchField={false}
                loadingProps={{ is: loading }}
            >
                <View style={styles.listViewContainer}>
                    <ListView
                        items={CUSTOMIZES_MENU(language, Lng)}
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
