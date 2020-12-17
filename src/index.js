import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '~/store';
import AppNavigator from '~/navigation';

console.disableYellowBox = true;

const Root = () => {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} >
                <AppNavigator />
            </PersistGate>
        </Provider>
    );
}

export default Root;
