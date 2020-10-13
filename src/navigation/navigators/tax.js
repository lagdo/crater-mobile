
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TaxesContainer from '~/features/taxes/containers/Taxes';
import TaxContainer from '~/features/taxes/containers/Tax';
import { ROUTES, navigationOptions } from '../routes';

const Stack = createStackNavigator();

export const TaxNavigator = () => {
    return (
    <Stack.Navigator screenOptions={navigationOptions}>
        <Stack.Screen name={ROUTES.TAXES} component={TaxesContainer} />
        <Stack.Screen name={ROUTES.TAX} component={TaxContainer} />
    </Stack.Navigator>
    );
}
