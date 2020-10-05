import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import ExpensesContainer from "../../features/expenses/containers/Expenses";
import ExpenseContainer from "../../features/expenses/containers/Expense";
import { ROUTES, navigationOptions } from "../routes";

const Stack = createStackNavigator();

export const ExpenseNavigator = ({ navigation, route }) => {
    const tabBarVisible = !route.state || route.state.index === 0;
    navigation.setOptions({ tabBarVisible });

    return (
    <Stack.Navigator screenOptions={navigationOptions}>
        <Stack.Screen name={ROUTES.MAIN_EXPENSES} component={ExpensesContainer} />
        <Stack.Screen name={ROUTES.EXPENSE} component={ExpenseContainer} />
    </Stack.Navigator>
    );
}
