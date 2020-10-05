import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import CustomersContainer from "../../features/customers/containers/Customers";
import CustomerContainer from "../../features/customers/containers/Customer";
import { ROUTES, navigationOptions } from "../routes";

const Stack = createStackNavigator();

export const CustomerNavigator = ({ navigation, route }) => {
    const tabBarVisible = !route.state || route.state.index === 0;
    navigation.setOptions({ tabBarVisible });

    return (
    <Stack.Navigator screenOptions={navigationOptions}>
        <Stack.Screen name={ROUTES.MAIN_CUSTOMERS} component={CustomersContainer} />
        <Stack.Screen name={ROUTES.CUSTOMER} component={CustomerContainer} />
    </Stack.Navigator>
    );
}
