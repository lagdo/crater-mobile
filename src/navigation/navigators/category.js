import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CategoriesContainer from '~/features/categories/containers/Categories';
import CategoryContainer from '~/features/categories/containers/Category';
import { ROUTES, navigationOptions } from '../routes';

const Stack = createStackNavigator();

export const CategoryNavigator = () => {
    return (
    <Stack.Navigator screenOptions={navigationOptions}>
        <Stack.Screen name={ROUTES.CATEGORIES} component={CategoriesContainer} />
        <Stack.Screen name={ROUTES.CATEGORY} component={CategoryContainer} />
    </Stack.Navigator>
    );
}
