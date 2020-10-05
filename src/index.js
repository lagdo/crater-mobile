import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { loadFonts } from './api/global';
import ApplicationNavigator from "./navigation/containers";
import { getBootstrap, getAppVersion } from './features/authentication/actions';
import { AppLoader } from './components';
import compareVersion from './api/compareVersion';
import { ROUTES } from './navigation/routes';
import { env } from './config';

console.disableYellowBox = true;

const Root = (props) => {
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        loadFonts({
            afterLoad: () => {
                const reduxStore = store.getState();

                const { idToken = null } = reduxStore.auth;
                if (idToken) {
                    store.dispatch(getBootstrap())
                }

                /*const { endpointApi = null } = reduxStore.global;
                if (endpointApi) {
                    (endpointApi !== null && typeof endpointApi !== 'undefined') &&
                    store.dispatch(getAppVersion({
                        onResult: ({ version }) => {
                                if (version && (parseInt(env.APP_VERSION) < parseInt(version))) {
                                    store.dispatch(
                                        NavigationActions.navigate({
                                            routeName: ROUTES.UPDATE_APP_VERSION,
                                        }),
                                    );
                                }
                            }
                        }))
                }*/
                setFontLoaded(true);
            },
        });
    }, []);

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} >
                {fontLoaded && (
                    <View style={{ flex: 1, position: 'relative' }}>
                        <ApplicationNavigator />
                        <AppLoader />
                    </View>
                )}
            </PersistGate>
        </Provider>
    );
}

export default Root;
