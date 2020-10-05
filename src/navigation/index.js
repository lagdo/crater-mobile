import React from 'react';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './navigators/auth';
import { HomeNavigator } from './navigators/home';
import { ROUTES } from './routes';

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
    const { idToken } = props;

    return (
    <NavigationContainer>
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

const mapStateToProps = ({ auth: { idToken } }) => ({ idToken });

export const AppNavigator = connect(
    mapStateToProps,
)(AppNavigatorComponent);

export default AppNavigator;
