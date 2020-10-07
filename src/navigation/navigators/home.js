import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES, navigationOptions } from "../routes";
import InvoiceContainer from '../../features/invoices/containers/Invoice';
import InvoiceItemContainer from '../../features/invoices/containers/Item';
import CustomerContainer from '../../features/customers/containers/Customer';
import PaymentContainer from "../../features/payments/containers/Payment";
import ExpenseContainer from "../../features/expenses/containers/Expense";

import { MainNavigator } from './main';
import { EstimateNavigator } from './estimate';
import { ItemNavigator } from './item';
import { ReportNavigator } from './report';
import { CategoryNavigator } from './category';
import { TaxNavigator } from './tax';
import { SettingsNavigator } from './settings';

const Stack = createStackNavigator();

export const HomeNavigator = () => {
    return (
    <Stack.Navigator screenOptions={navigationOptions}>
        <Stack.Screen name={ROUTES.MAIN} component={MainNavigator} />

        <Stack.Screen name={ROUTES.INVOICE} component={InvoiceContainer} />
        <Stack.Screen name={ROUTES.INVOICE_ITEM} component={InvoiceItemContainer} />

        <Stack.Screen name={ROUTES.CUSTOMER} component={CustomerContainer} />

        <Stack.Screen name={ROUTES.PAYMENT} component={PaymentContainer} />

        <Stack.Screen name={ROUTES.EXPENSE} component={ExpenseContainer} />

        <Stack.Screen name={ROUTES.ESTIMATE_LIST} component={EstimateNavigator} />
        <Stack.Screen name={ROUTES.GLOBAL_ITEMS} component={ItemNavigator} />
        <Stack.Screen name={ROUTES.REPORTS} component={ReportNavigator} />
        <Stack.Screen name={ROUTES.CATEGORIES} component={CategoryNavigator} />
        <Stack.Screen name={ROUTES.TAXES} component={TaxNavigator} />
        <Stack.Screen name={ROUTES.SETTING_LIST} component={SettingsNavigator} />
    </Stack.Navigator>
    );
}
