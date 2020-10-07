import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import ReportsContainer from "../../features/reports/containers/Reports";
import ReportContainer from "../../features/reports/containers/Report";
import { ROUTES, navigationOptions } from "../routes";

const Stack = createStackNavigator();

export const ReportNavigator = () => {
    return (
    <Stack.Navigator screenOptions={navigationOptions}>
        <Stack.Screen name={ROUTES.REPORTS} component={ReportsContainer} />
        <Stack.Screen name={ROUTES.GENERATE_REPORT} component={ReportContainer} />
    </Stack.Navigator>
    );
}
