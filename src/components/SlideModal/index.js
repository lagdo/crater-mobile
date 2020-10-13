import React from 'react';
import {
    View,
    Modal,
    StatusBar
} from 'react-native';
import styles from './styles';
import { ListView } from '../ListView';
import { MainLayout, DefaultLayout } from '../Layouts';
import { colors } from '~/styles/colors';

type IProps = {
    visible: Boolean,
    onToggle: Function,
    headerProps: Object,
    onSearch: Function,
    bottomDivider: Boolean,
    hasSearchField: Boolean,
    listViewProps: Object,
    defaultLayout: Boolean,
    children: Object,
    bottomAction: Object,
    searchInputProps: Object,
};

export const SlideModal = (props: IProps) => {
    const {
        visible,
        onToggle,
        headerProps,
        onSearch,
        bottomDivider = false,
        listViewProps,
        hasListView,
        imageListView,
        defaultLayout,
        children,
        hasSearchField,
        bottomAction,
        searchInputProps
    } = props;

    return (
        <Modal
            animationType="slide"
            visible={visible}
            onRequestClose={onToggle && onToggle}
            hardwareAccelerated={true}
        >
            <StatusBar
                backgroundColor={colors.secondary}
                barStyle={"dark-content"}
                translucent={true}
            />

            <View style={styles.modalContainer}>
                {!defaultLayout && (
                    <MainLayout
                        headerProps={headerProps && headerProps}
                        onSearch={onSearch}
                        bottomDivider={bottomDivider}
                        bottomAction={bottomAction}
                        inputProps={searchInputProps && searchInputProps}
                    >
                        <View style={styles.listViewContainer}>
                            <ListView
                                {...listViewProps}
                            />
                        </View>
                    </MainLayout>
                )}

                {defaultLayout && (
                    <DefaultLayout
                        headerProps={headerProps && headerProps}
                        bottomAction={bottomAction}
                    >
                        {children ? (
                            <View style={styles.bodyContainer}>
                                {children}
                            </View>
                        ) : (
                                <View style={styles.listViewContainer}>
                                    <ListView
                                        {...listViewProps}
                                    />
                                </View>
                            )}

                    </DefaultLayout>
                )}
            </View>
        </Modal>
    );
}
