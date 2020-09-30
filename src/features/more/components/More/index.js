// @flow

import React, { useEffect } from 'react';
import { View } from 'react-native';
import styles from './styles';
import { MainLayout, ListView } from '../../../../components';
import { MORE_MENU } from '../../constants';
import { colors } from '../../../../styles/colors';
import Lng from '../../../../api/lang/i18n';
import { goBack, MOUNT, UNMOUNT } from '../../../../navigation/actions';
import { ROUTES } from '../../../../navigation/routes';
import { alertMe } from '../../../../api/global';

export const More = (props) => {
    const {
        navigation,
        language,
        logout,
    } = props;

    useEffect(() => {
        goBack(MOUNT, navigation, { route: ROUTES.MAIN_INVOICES });

        return () => goBack(UNMOUNT);
    }, []);

    const onLogout = () => {
        alertMe({
            title: Lng.t("logout.confirmation", { locale: language }),
            showCancel: true,
            okText: Lng.t("logout.title", { locale: language }),
            okPress: () => logout({ navigation })
        })
    }

    const onSelectMenu = (item) => {
        if (item.route) {
            navigation.navigate(item.route)
        } else if (item.action === 'onLogout') {
            onLogout();
        }
    }

    return (
        <View style={styles.container}>
            <MainLayout
                headerProps={{
                    hasCircle: false,
                    title: Lng.t("header.more", { locale: language })
                }}
                bottomDivider
                dividerStyle={styles.dividerStyle}
                hasSearchField={false}
            >
                <View style={styles.listViewContainer}>
                    <ListView
                        items={MORE_MENU(language, Lng)}
                        onPress={onSelectMenu}
                        hasAvatar
                        refreshing={false}
                        leftTitleStyle={styles.listViewTitle}
                        leftIconStyle={styles.listViewIcon}
                        itemContainer={styles.itemContainer}
                        listViewContainerStyle={styles.listViewScrollContainerStyle}
                        listItemProps={{
                            chevron: {
                                size: 19,
                                color: colors.darkGray,
                                containerStyle: { marginTop: 5 },
                            },
                        }}
                    />
                </View>

            </MainLayout>
        </View>
    );
}
