import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InvoicesContainer from '~/features/invoices/containers/Invoices';
import InvoiceContainer from '~/features/invoices/containers/Invoice';
import InvoiceItemContainer from '~/features/invoices/containers/Item';
import { ROUTES, navigationOptions } from '../routes';

const Stack = createStackNavigator();

export const InvoiceNavigator = ({ navigation, route }) => {
    const tabBarVisible = !route.state || route.state.index === 0;
    navigation.setOptions({ tabBarVisible });

    return (
    <Stack.Navigator screenOptions={navigationOptions}>
        <Stack.Screen name={ROUTES.MAIN_INVOICES} component={InvoicesContainer} />
        <Stack.Screen name={ROUTES.INVOICE} component={InvoiceContainer} />
        <Stack.Screen name={ROUTES.INVOICE_ITEM} component={InvoiceItemContainer} />
    </Stack.Navigator>
    );
}
