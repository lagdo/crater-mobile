// @flow
import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { styles } from './styles';
import { ListView, Content } from '~/components';
import { IMAGES } from '~/config';
import { ESTIMATES_STATUS, ESTIMATE_ADD, ESTIMATES_STATUS_BG_COLOR, ESTIMATES_STATUS_TEXT_COLOR } from '../../constants';
import { ROUTES } from '~/navigation/routes';
import Lng from '~/api/lang/i18n';

type IProps = {
    estimates: Array,
    onEstimateSelect: Function,
    getEstimates: Function,
    loading: String,
    canLoadMore: Boolean,
    refreshing: Boolean,
    fresh: Boolean,
    search: String,
    onAddEstimate: Function,
    loadMoreItems: Function,
    filter: Boolean
};

const All = ({
    estimates,
    onEstimateSelect,
    refreshing,
    loading,
    canLoadMore,
    getEstimates,
    fresh,
    search,
    navigation,
    onAddEstimate,
    loadMoreItems,
    filter
}: IProps) => {

    let empty = (!filter && !search) ? {
        description: Lng.t("estimates.empty.all.description"),
        buttonTitle: Lng.t("estimates.empty.buttonTitle"),
        buttonPress: () => onAddEstimate()
    } : {}

    let emptyTitle = search ? Lng.t("search.noResult", { search })
        : (!filter) ? Lng.t("estimates.empty.all.title") :
            Lng.t("filter.empty.filterTitle")

    return (
        <View style={styles.content}>
            <Content loadingProps={{ is: refreshing && fresh }}>
                <ListView
                    items={estimates}
                    onPress={onEstimateSelect}
                    refreshing={refreshing}
                    loading={loading}
                    isEmpty={estimates.length <= 0}
                    canLoadMore={canLoadMore}
                    getFreshItems={(onHide) => {
                        getEstimates({
                            fresh: true,
                            onResult: onHide,
                            type: '',
                            q: search,
                            resetFilter: true
                        });
                    }}
                    getItems={() => {
                        loadMoreItems({
                            type: '',
                            q: search,
                        });
                    }}
                    bottomDivider
                    emptyContentProps={{
                        title: emptyTitle,
                        image: IMAGES.EMPTY_ESTIMATES,
                        ...empty
                    }}
                />
            </Content>
        </View>
    );
};

export default All;
