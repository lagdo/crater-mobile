// @flow

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import styles from './styles';
import { ListView, DefaultLayout } from '../../../../components';
import { ROUTES } from '../../../../navigation/routes';
import { colors } from '../../../../styles/colors';
import Lng from '../../../../api/lang/i18n';
import { SETTINGS_MENU } from '../../constants';
import { MOUNT, goBack, UNMOUNT } from '../../../../navigation/actions';

export const Settings = (props) => {
    const {
        navigation,
        language,
    } = props;

    // const [endpointVisible, setEndpointVisible] = useState(false);

    useEffect(() => {
        goBack(MOUNT, navigation, { route: ROUTES.MAIN_MORE });

        return () => goBack(UNMOUNT);
    }, []);

    const onSelectMenu = (item) => {
        if (item.route) {
            (item.route === ROUTES.ENDPOINTS_SETTINGS)
                ? navigation.navigate(item.route, { skipEndpoint: true }) :
                navigation.navigate(item.route)
        }
    }

    return (
        <View style={styles.container}>
            <DefaultLayout
                headerProps={{
                    leftIconPress: () => navigation.navigate(ROUTES.MAIN_MORE),
                    title: Lng.t("header.settings", { locale: language }),
                    leftIconStyle: { color: colors.dark2 }
                }}
                hasSearchField={false}
            >
                <View style={styles.listViewContainer}>
                    <ListView
                        items={SETTINGS_MENU(language, Lng)}
                        onPress={onSelectMenu}
                        leftTitleStyle={styles.listViewTitle}
                        leftIconStyle={styles.listViewIcon}
                        itemContainer={styles.itemContainer}
                        hasAvatar
                        listItemProps={{
                            chevron: {
                                size: 18,
                                color: colors.darkGray,
                                containerStyle: { marginTop: 5 }
                            }
                        }}
                    />
                </View>
            </DefaultLayout>
        </View>
    );
}
