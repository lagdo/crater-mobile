import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './navigators/auth';
import { HomeNavigator } from './navigators/home';
import { ROUTES } from './routes';
import { resetIdToken } from '../features/authentication/actions'
import Request from '../api/request';
import { navigationRef } from './actions';
import Lng from '../api/lang/i18n';

const Stack = createStackNavigator();
const navigationOptions = {
    headerShown: false,
    headerTransparent: true,
    gesturesEnabled: false,
    headerTitleAllowFontScaling: false,
};

type IProps = {
    idToken: string,
};

const AppNavigatorComponent = (props: IProps) => {
    const { idToken, expiresIn, endpointApi, company, language } = props;

    useEffect(() => {
        Request.setProps(props);
    }, [idToken, expiresIn, endpointApi, company]);

    useEffect(() => {
        // Save the language
        Lng.locale = language;
    }, [language]);

    return (
    <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={navigationOptions}>
        {(idToken) ? (
            <Stack.Screen name={ROUTES.HOME} component={HomeNavigator} />
        ) : (
            <Stack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
        )}
        </Stack.Navigator>
    </NavigationContainer>
    );
}

const mapStateToProps = (state) => {
    const {
        auth: { idToken, expiresIn = null },
        global: { endpointApi = null, company, language }
    } = state;
    return { idToken, expiresIn, endpointApi, company, language };
};

const mapDispatchToProps = { resetIdToken };

export const AppNavigator = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppNavigatorComponent);

export default AppNavigator;
