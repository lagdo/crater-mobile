// @flow

import React from 'react';
import { View } from 'react-native';
import styles from './styles';
import { ListView, DefaultLayout } from '../../../../components';
import { ROUTES } from '../../../../navigation/routes';
import { colors } from '../../../../styles/colors';
import Lng from '../../../../api/lang/i18n';
import { REPORTS_MENU } from '../../constants';

export const Reports = (props) => {
    const {
        navigation,
    } = props;

    const onSelectMenu = ({ route, type }) => {
        if (route) {
            navigation.navigate(route, { type })
        }
    }

    return (
        <View style={styles.container}>
            <DefaultLayout
                headerProps={{
                    leftIconPress: () => navigation.navigate(ROUTES.MAIN_MORE),
                    title: Lng.t("header.reports"),
                    leftIconStyle: { color: colors.dark2 }
                }}
                hasSearchField={false}
            >
                <View style={styles.listViewContainer}>
                    <ListView
                        items={REPORTS_MENU()}
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
