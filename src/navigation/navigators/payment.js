import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import PaymentsContainer from "../../features/payments/containers/Payments";
import PaymentContainer from "../../features/payments/containers/Payment";
import { ROUTES, navigationOptions } from "../routes";

const Stack = createStackNavigator();

export const PaymentNavigator = ({ navigation, route }) => {
    const tabBarVisible = !route.state || route.state.index === 0;
    navigation.setOptions({ tabBarVisible });

    return (
    <Stack.Navigator screenOptions={navigationOptions}>
        <Stack.Screen name={ROUTES.MAIN_PAYMENTS} component={PaymentsContainer} />
        <Stack.Screen name={ROUTES.PAYMENT} component={PaymentContainer} />
    </Stack.Navigator>
    );
}
