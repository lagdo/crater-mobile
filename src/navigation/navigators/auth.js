import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginContainer from '~/features/authentication/containers/Login';
import ForgotPasswordContainer from '~/features/authentication/containers/ForgetPassword';
import EndpointContainer from '~/features/authentication/containers/Endpoint';
// import UpdateAppVersion from '~/components/UpdateAppVersion';
import { ROUTES, navigationOptions } from '../routes';

const Stack = createStackNavigator();

export const AuthNavigator = () => {
    return (
    <Stack.Navigator screenOptions={navigationOptions}>
        <Stack.Screen
            name={ROUTES.LOGIN}
            component={LoginContainer} />
        <Stack.Screen
            name={ROUTES.FORGOT_PASSWORD}
            component={ForgotPasswordContainer} />
        <Stack.Screen
            name={ROUTES.ENDPOINTS}
            component={EndpointContainer} />
        {/*<Stack.Screen
            name={ROUTES.UPDATE_APP_VERSION}
            component={EndpointContainer} />*/}
    </Stack.Navigator>
    );
}
