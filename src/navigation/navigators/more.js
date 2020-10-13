import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MoreContainer from '~/features/more/containers/More';
import { EstimateNavigator } from './estimate';
import { ItemNavigator } from './item';
import { ReportNavigator } from './report';
import { CategoryNavigator } from './category';
import { TaxNavigator } from './tax';
import { SettingsNavigator } from './settings';
import { ROUTES, navigationOptions } from '../routes';

const Stack = createStackNavigator();

export const MoreNavigator = ({ navigation, route }) => {
    const tabBarVisible = !route.state || route.state.index === 0;
    navigation.setOptions({ tabBarVisible });

    return (
    <Stack.Navigator screenOptions={navigationOptions}>
        <Stack.Screen name={ROUTES.MORE} component={MoreContainer} />
        <Stack.Screen name={ROUTES.ESTIMATE_LIST} component={EstimateNavigator} />
        <Stack.Screen name={ROUTES.GLOBAL_ITEMS} component={ItemNavigator} />
        <Stack.Screen name={ROUTES.REPORTS} component={ReportNavigator} />
        <Stack.Screen name={ROUTES.CATEGORIES} component={CategoryNavigator} />
        <Stack.Screen name={ROUTES.TAXES} component={TaxNavigator} />
        <Stack.Screen name={ROUTES.SETTING_LIST} component={SettingsNavigator} />
    </Stack.Navigator>
    );
}
