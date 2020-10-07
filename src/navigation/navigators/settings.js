import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import SettingsContainer from "../../features/settings/containers/Settings";
import AccountContainer from "../../features/settings/containers/Account";
import CompanyContainer from "../../features/settings/containers/Company";
import LanguageAndCurrencyContainer from "../../features/settings/containers/LanguageAndCurrency";
import NotificationContainer from "../../features/settings/containers/Notification";
import PreferencesContainer from "../../features/settings/containers/Preferences";
import EndpointContainer from "../../features/authentication/containers/Endpoint";
import UpdateAppVersionContainer from "../../components/UpdateAppVersion";
import CustomizesContainer from "../../features/settings/containers/Customizes";
import CustomizeContainer from "../../features/settings/containers/Customize";
import { ROUTES, navigationOptions } from "../routes";

const Stack = createStackNavigator();

export const SettingsNavigator = () => {
    return (
    <Stack.Navigator screenOptions={navigationOptions}>
        <Stack.Screen name={ROUTES.SETTING_LIST} component={SettingsContainer} />
        <Stack.Screen name={ROUTES.LANGUAGE_AND_CURRENCY} component={LanguageAndCurrencyContainer} />
        <Stack.Screen name={ROUTES.NOTIFICATIONS} component={NotificationContainer} />
        <Stack.Screen name={ROUTES.PREFERENCES} component={PreferencesContainer} />
        <Stack.Screen name={ROUTES.ACCOUNT_INFO} component={AccountContainer} />
        <Stack.Screen name={ROUTES.COMPANY_INFO} component={CompanyContainer} />
        <Stack.Screen name={ROUTES.ENDPOINTS_SETTINGS} component={EndpointContainer} />
        <Stack.Screen name={ROUTES.CUSTOMIZES} component={CustomizesContainer} />
        <Stack.Screen name={ROUTES.CUSTOMIZE} component={CustomizeContainer} />
        <Stack.Screen name={ROUTES.UPDATE_APP_VERSION} component={UpdateAppVersionContainer} />
    </Stack.Navigator>
    );
}
