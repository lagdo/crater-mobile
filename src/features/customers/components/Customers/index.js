// @flow

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import styles from './styles';
import { ListView, MainLayout } from '~/components';
import { IMAGES } from '~/config';
import { ROUTES } from '~/navigation/routes';
import Lng from '~/api/lang/i18n';
import { CUSTOMER_ADD, CUSTOMER_EDIT } from '../../constants';

type IProps = {
    customers: Object,
    navigation: Object,
    loading: Boolean,
}

const defaultParams = {
    search: '',
    display_name: '',
    contact_name: '',
    phone: '',
}

let filterRefs = {};

export const Customers = (props: IProps) => {
    const {
        navigation,
        loading,
        customers,
        filterCustomers,
        getCustomer,
        route: { params = {} },
    } = props;

    const [refreshing, setRefreshing] = useState(false);
    const [fresh, setFresh] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, lastPage: 1 });
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState(false);

    useEffect(() => {
        getItems({ fresh: true });
    }, []);

    const getItems = ({ fresh = false, params, onResult, filter = false } = {}) => {
        if (refreshing) {
            return;
        }

        setRefreshing(true);
        setFresh(fresh);

        const paginationParams = fresh ? { ...pagination, page: 1 } : pagination;

        if (!fresh && paginationParams.lastPage < paginationParams.page) {
            return;
        }

        getCustomer({
            fresh,
            pagination: paginationParams,
            params,
            filter,
            onMeta: ({ last_page, current_page }) => {
                setPagination({
                    ...paginationParams,
                    lastPage: last_page,
                    page: current_page + 1,
                });
            },
            onResult: (val) => {
                setRefreshing(false);
                setFresh(!val);
                onResult && onResult();
            },
        });
    };

    const onSearch = (keywords) => {
        onResetFilter();
        setSearch(keywords);
        getItems({ fresh: true, params: { ...defaultParams, search: keywords } });
    };

    const onResetFilter = () => setFilter(false);

    const onSubmitFilter = ({ name = '', contact_name = '', phone = '' }) => {
        if (name || contact_name || phone) {
            setFilter(true);

            filterRefs.params = {
                display_name: name,
                contact_name,
                phone,
            };
            getItems({
                fresh: true,
                params: {
                    ...defaultParams,
                    ...filterRefs.params,
                },
                filter: true,
            });
            return;
        }

        onResetFilter();
    };

    const onAddCustomer = () => {
        navigation.navigate(ROUTES.CUSTOMER, { type: CUSTOMER_ADD });
        onResetFilter();
    };

    const onCustomerSelect = (customer) => {
        navigation.navigate(ROUTES.CUSTOMER, { customerId: customer.id, type: CUSTOMER_EDIT });
        onResetFilter();
    };

    const loadMoreItems = () => {
        if (!filter) {
            getItems({ params: { ...defaultParams, search } });
            return;
        }

        getItems({
            params: {
                ...defaultParams,
                ...filterRefs.params,
            },
            filter: true,
        });
    }

    const { lastPage, page } = pagination;

    const canLoadMore = lastPage >= page;

    const inputFields = [
        {
            name: 'name',
            hint: Lng.t("customers.filterDisplayName"),
            inputProps: {
                autoCorrect: true,
                autoFocus: true,
                onSubmitEditing: () => filterRefs.contactName.focus(),
            }
        },
        {
            name: 'contact_name',
            hint: Lng.t("customers.filterContactName"),
            inputProps: {
                autoCorrect: true,
                onSubmitEditing: () => filterRefs.phone.focus(),
            },
            refLinkFn: (ref) => filterRefs.contactName = ref
        },
        {
            name: 'phone',
            hint: Lng.t("customers.phone"),
            inputProps: {
                keyboardType: 'phone-pad',
            },
            refLinkFn: (ref) => filterRefs.phone = ref
        }
    ]

    const empty = (!filter && !search) ? {
        description: Lng.t("customers.empty.description"),
        buttonTitle: Lng.t("customers.empty.buttonTitle"),
        buttonPress: onAddCustomer,
    } : {};

    const emptyTitle = search ? Lng.t("search.noResult", { search })
        : (!filter) ? Lng.t("customers.empty.title") :
            Lng.t("filter.empty.filterTitle");

    return (
        <View style={styles.container}>
            <MainLayout
                headerProps={{
                    rightIcon: "plus",
                    rightIconPress: onAddCustomer,
                    title: Lng.t("header.customers")
                }}
                onSearch={onSearch}
                filterProps={{
                    onSubmitFilter: onSubmitFilter,
                    inputFields: inputFields,
                    clearFilter: props,
                    onResetFilter: onResetFilter
                }}
                bottomDivider
                loadingProps={{ is: loading && fresh }}
            >
                <View style={styles.listViewContainer}>
                    <ListView
                        items={!filter ? customers : filterCustomers}
                        onPress={onCustomerSelect}
                        refreshing={refreshing}
                        loading={loading}
                        isEmpty={!filter ? customers && customers.length <= 0 :
                            filterCustomers && filterCustomers.length <= 0
                        }
                        canLoadMore={canLoadMore}
                        getFreshItems={(onHide) => {
                            onResetFilter()
                            getItems({
                                fresh: true,
                                onResult: onHide,
                                params: { ...defaultParams, search }
                            });
                        }}
                        getItems={loadMoreItems}
                        bottomDivider
                        hasAvatar
                        emptyContentProps={{
                            title: emptyTitle,
                            image: IMAGES.EMPTY_CUSTOMERS,
                            ...empty
                        }}
                    />
                </View>
            </MainLayout>
        </View>
    );
}
