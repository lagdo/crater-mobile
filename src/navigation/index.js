import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { resetIdToken, getBootstrap, getAppVersion } from '../features/authentication/actions'
import Request from '~/api/request';
import Lng from '~/api/lang/i18n';
import { loadFonts } from '~/api/global';
import { AppLoader } from '~/components';
import { env } from '~/config';
import { AuthNavigator } from './navigators/auth';
import { HomeNavigator } from './navigators/home';
import UpdateAppVersion from '~/components/UpdateAppVersion';
import { ROUTES } from './routes';
import { navigationRef } from './actions';

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
    const {
        company,
        language,
        endpointApi,
        idToken,
        expiresIn,
        resetIdToken,
        getBootstrap,
        getAppVersion,
    } = props;

    const [newVersionAvailable, setNewVersionAvailable] = useState(false);
    const [bootstrapped, setBootstrapped] = useState(false);
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        loadFonts({ afterLoad: () => setFontLoaded(true) });
    }, []);

    useEffect(() => {
        Request.setProps({ idToken, expiresIn, endpointApi, company, resetIdToken });

        if (!bootstrapped && idToken && company) {
            setBootstrapped(true);
            getBootstrap();

            if (endpointApi !== null && endpointApi !== undefined) {
                getAppVersion({
                    onResult: ({ version }) => {
                        setNewVersionAvailable(version && (parseInt(env.APP_VERSION) < parseInt(version)));
                    }
                });
            }
        }
    }, [idToken, expiresIn, endpointApi, company]);

    useEffect(() => {
        // Save the language
        Lng.locale = language;
    }, [language]);

    return (
    <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={navigationOptions}>
        {(!fontLoaded) ? (
            <Stack.Screen name={ROUTES.HOME} component={AppLoader} />
        ) : (newVersionAvailable) ? (
            <Stack.Screen name={ROUTES.UPDATE_APP_VERSION} component={UpdateAppVersion} />
        ) : (idToken) ? (
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

const mapDispatchToProps = { resetIdToken, getBootstrap, getAppVersion };

export const AppNavigator = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppNavigatorComponent);

export default AppNavigator;
