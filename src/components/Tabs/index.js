import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { styles } from './styles';
import { getConditionStyles } from '~/api/helper';

type IProps = {
    activeTab: boolean,
    tabs: Array<Object>,
    setActiveTab: Function,
    style: Object,
};

export const Tabs = (props: IProps) => {
    const {
        activeTab,
        setActiveTab,
        tabs,
        style,
        tabStyle
    } = props;

    const { render } = tabs.find(({ id, Title }) => [id, Title].includes(activeTab));

    !activeTab && setActiveTab(tabs[0].Title || tabs[0].id);

    return (
        <View style={{ ...styles.container, ...style }}>
            <View style={[styles.tabs, tabStyle && tabStyle]}>
                {tabs.map(({ id, Title, tabName }) => (
                    <TouchableOpacity
                        key={Title}
                        activeOpacity={0.8}
                        style={getConditionStyles([
                            styles.tab,
                            {
                                condition: [Title, id].includes(activeTab),
                                style: styles.selected_tab,
                            },
                        ])}
                        onPress={() => setActiveTab(Title)}
                    >
                        {typeof tabName === 'string' ? (
                            <Text
                                style={[styles.TabTitle, activeTab === Title && styles.selectedTabTitle]}
                            >
                                {tabName && tabName}
                            </Text>
                        ) : (
                                tabName && tabName({ active: [tabName, id].includes(activeTab) })
                            )}
                    </TouchableOpacity>
                ))}
            </View>
            {render}
        </View>
    );
}
