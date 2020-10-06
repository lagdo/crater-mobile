// @flow
import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { ListView, Content } from '../../../../components';
import { IMAGES } from '../../../../config';
import Lng from '../../../../api/lang/i18n';
import { INVOICES_STATUS_TEXT_COLOR, INVOICES_STATUS_BG_COLOR } from '../../constants';

type IProps = {
    invoices: Array,
    onInvoiceSelect: Function,
    getInvoices: Function,
    loading: String,
    canLoadMore: Boolean,
    refreshing: Boolean,
    fresh: Boolean,
    search: String,
    loadMoreItems: Function,
    onAddInvoice: Function,
    filter: Boolean
};

const Draft = ({
    invoices,
    onInvoiceSelect,
    refreshing,
    loading,
    canLoadMore,
    getInvoices,
    fresh,
    search,
    navigation,
    loadMoreItems,
    onAddInvoice,
    filter,
    route: { params = {} },
}: IProps) => {
    let items = [];

    if (typeof invoices !== 'undefined' && invoices.length != 0) {
        items = invoices.map((item) => {
            const {
                invoice_number,
                user: { name, currency } = {},
                status,
                formattedInvoiceDate,
                total,
            } = item;

            return {
                title: name,
                subtitle: {
                    title: invoice_number,
                    label: status,
                    labelBgColor: INVOICES_STATUS_BG_COLOR[status],
                    labelTextColor: INVOICES_STATUS_TEXT_COLOR[status],
                },
                amount: total,
                currency,
                rightSubtitle: formattedInvoiceDate,
                fullItem: item,
            };
        });
    }


    let empty = (!filter && !search) ? {
        description: Lng.t("invoices.empty.draft.description"),
        buttonTitle: Lng.t("invoices.empty.buttonTitle"),
        buttonPress: () => onAddInvoice(),
    } : {}

    let emptyTitle = search ? Lng.t("search.noResult", { search })
        : (!filter) ? Lng.t("invoices.empty.draft.title") :
            Lng.t("filter.empty.filterTitle")

    const { isLoading } = params;

    return (
        <View style={styles.content}>
            <Content loadingProps={{ is: isLoading || (refreshing && fresh) }}>
                <ListView
                    items={items}
                    onPress={onInvoiceSelect}
                    refreshing={refreshing}
                    loading={loading}
                    isEmpty={items.length <= 0}
                    canLoadMore={canLoadMore}
                    getFreshItems={(onHide) => {
                        getInvoices({
                            fresh: true,
                            onResult: onHide,
                            type: 'DRAFT',
                            q: search,
                            resetFilter: true
                        });
                    }}
                    getItems={() => {
                        loadMoreItems({
                            type: 'DRAFT',
                            q: search,
                        });
                    }}
                    bottomDivider
                    emptyContentProps={{
                        title: emptyTitle,
                        image: IMAGES.EMPTY_INVOICES,
                        ...empty
                    }}
                />
            </Content>
        </View>
    );
};

export default Draft;
