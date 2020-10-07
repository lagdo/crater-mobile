// @flow

import React from 'react';
import { View } from 'react-native';
import styles from './styles';
import { MainLayout, ListView } from '../../../../components';
import { MORE_MENU } from '../../constants';
import { colors } from '../../../../styles/colors';
import Lng from '../../../../api/lang/i18n';
import { alertMe } from '../../../../api/global';

export const More = (props) => {
    const {
        navigation,
        logout,
    } = props;

    const onLogout = () => {
        alertMe({
            title: Lng.t("logout.confirmation"),
            showCancel: true,
            okText: Lng.t("logout.title"),
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
                    title: Lng.t("header.more")
                }}
                bottomDivider
                dividerStyle={styles.dividerStyle}
                hasSearchField={false}
            >
                <View style={styles.listViewContainer}>
                    <ListView
                        items={MORE_MENU()}
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
