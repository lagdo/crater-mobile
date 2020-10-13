import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SvgXml } from 'react-native-svg';
import * as SVG_ICONS from '../../assets/svg';
import { ROUTES } from '../routes';
import { isIPhoneX } from '../../api/helper';
import { fonts } from '../../styles/fonts';
import { colors } from '~/styles/colors';
import InvoicesContainer from '~/features/invoices/containers/Invoices';
import CustomersContainer from '~/features/customers/containers/Customers';
import ExpensesContainer from '~/features/expenses/containers/Expenses';
import PaymentsContainer from '~/features/payments/containers/Payments';
import MoreContainer from '~/features/more/containers/More';

import { getTitleByLanguage } from '../actions';

const Tab = createBottomTabNavigator();

const labelStyle = {
    fontFamily: fonts.poppinsMedium,
    fontSize: 12,
    marginTop: -4,
};
const tabBarOptions = {
    showIcon: true,
    showLabel: true,
    activeTintColor: colors.primary,
    inactiveTintColor: colors.dark2,
    allowFontScaling: false,
    style: {
        backgroundColor: colors.white,
        width: '100%',
        height: isIPhoneX() ? 65 : 75,
        borderTopWidth: 0,
        paddingVertical: 7,
        position: "relative",
        bottom: 0,
        left: 0,
        right: 0,
        marginBottom: 0
    },
    labelStyle,
};

const getIcon = (name, focused) => (
    <SvgXml xml={name} fill={focused ? colors.primary : colors.darkGray} width="22" height="22" />
);

const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused }) => {
        switch (route.name) {
        case ROUTES.MAIN_INVOICES:
            return getIcon(SVG_ICONS.INVOICES, focused);
        case ROUTES.MAIN_CUSTOMERS:
            return getIcon(SVG_ICONS.CUSTOMERS, focused);
        case ROUTES.MAIN_PAYMENTS:
            return getIcon(SVG_ICONS.PAYMETNS, focused);
        case ROUTES.MAIN_EXPENSES:
            return getIcon(SVG_ICONS.EXPENSES, focused);
        default:
            return getIcon(SVG_ICONS.MORE, focused);
        }
    },
    tabBarLabel: () => {
        let titleLabel = '';
        switch (route.name) {
        case ROUTES.MAIN_INVOICES:
            titleLabel = 'tabNavigation.invoices';
            break;
        case ROUTES.MAIN_CUSTOMERS:
            titleLabel = 'tabNavigation.customers';
            break;
        case ROUTES.MAIN_PAYMENTS:
            titleLabel = 'tabNavigation.payments';
            break;
        case ROUTES.MAIN_EXPENSES:
            titleLabel = 'tabNavigation.expenses';
            break;
        default:
            titleLabel = 'tabNavigation.more';
        }

        return <Text style={labelStyle}>{getTitleByLanguage(titleLabel)}</Text>;
    },
    headerShown: false,
    headerTitleAllowFontScaling: false,
});

const MainNavigatorComponent = () => {
    return (
    <Tab.Navigator
        screenOptions={screenOptions}
        tabBarOptions={tabBarOptions}
        initialRouteName={ROUTES.MAIN_INVOICES}
        backBehavior="initialRoute"
    >
        <Tab.Screen name={ROUTES.MAIN_INVOICES} component={InvoicesContainer} />
        <Tab.Screen name={ROUTES.MAIN_CUSTOMERS} component={CustomersContainer} />
        <Tab.Screen name={ROUTES.MAIN_PAYMENTS} component={PaymentsContainer} />
        <Tab.Screen name={ROUTES.MAIN_EXPENSES} component={ExpensesContainer} />
        <Tab.Screen name={ROUTES.MAIN_MORE} component={MoreContainer} />
    </Tab.Navigator>
    );
}

/*
 * We must map the language into the MainNavigator component in order
 * to have the tabs menus updated instantly when the language changes.
 */
const mapStateToProps = ({ settings: { language } }) => ({ language });

export const MainNavigator = connect(
    mapStateToProps,
)(MainNavigatorComponent);
