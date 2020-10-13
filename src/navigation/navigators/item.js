import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ItemsContainer from '~/features/items/containers/Items';
import ItemContainer from '~/features/items/containers/Item';
import { ROUTES, navigationOptions } from '../routes';

const Stack = createStackNavigator();

export const ItemNavigator = () => {
    return (
    <Stack.Navigator screenOptions={navigationOptions}>
        <Stack.Screen name={ROUTES.GLOBAL_ITEMS} component={ItemsContainer} />
        <Stack.Screen name={ROUTES.GLOBAL_ITEM} component={ItemContainer} />
    </Stack.Navigator>
    );
}
