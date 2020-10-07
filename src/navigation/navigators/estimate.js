import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import EstimatesContainer from '../../features/estimates/containers/Estimates';
import EstimateContainer from '../../features/estimates/containers/Estimate';
import EstimateItemContainer from '../../features/estimates/containers/Item';
import { ROUTES, navigationOptions } from "../routes";

const Stack = createStackNavigator();

export const EstimateNavigator = () => {
    return (
    <Stack.Navigator screenOptions={navigationOptions}>
        <Stack.Screen name={ROUTES.ESTIMATE_LIST} component={EstimatesContainer} />
        <Stack.Screen name={ROUTES.ESTIMATE} component={EstimateContainer} />
        <Stack.Screen name={ROUTES.ESTIMATE_ITEM} component={EstimateItemContainer} />
    </Stack.Navigator>
    );
}
