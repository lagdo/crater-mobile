// @flow

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { change } from 'redux-form';
import styles from './styles';
import { Tabs, MainLayout } from '../../../../components';
import Sent from '../Tab/Sent';
import Draft from '../Tab/Draft';
import All from '../Tab/All';

import { ROUTES } from '../../../../navigation/routes';
import { ESTIMATES_TABS, ESTIMATE_ADD, ESTIMATE_EDIT, ESTIMATE_SEARCH, FILTER_ESTIMATE_STATUS, TAB_NAME } from '../../constants';
import Lng from '../../../../api/lang/i18n';
import { goBack, MOUNT, UNMOUNT } from '../../../../navigation/actions';
import { IMAGES } from '../../../../config';

let params = {
    search: '',
    customer_id: '',
    estimate_number: '',
    from_date: '',
    to_date: '',
}


type IProps = {
    language: String,
    navigation: Object,
    estimates: Object,
    customers: Object,
    loading: Boolean,
    handleSubmit: Function,
    getCustomers: Function,
}

export const Estimates = (props: IProps) => {
    const {
        navigation,
        language,
        loading,
        handleSubmit,
        estimates,
        getEstimates,
        customers,
        getCustomers,
        formValues: {
            filterStatus = '',
            from_date = '',
            to_date = '',
            estimate_number = '',
            customer_id = '',
        },
    } = props;

    const [activeTab, setActiveTab] = useState(ESTIMATES_TABS.DRAFT);
    const [refreshing, setRefreshing] = useState(false);
    const [fresh, setFresh] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        lastPage: 1,
    });
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState(false);
    const [selectedFromDate, setSelectedFromDate] = useState('');
    const [selectedToDate, setSelectedToDate] = useState('');
    const [selectedFromDateValue, setSelectedFromDateValue] = useState('');
    const [selectedToDateValue, setSelectedToDateValue] = useState('');

    useEffect(() => {
        getItems({ fresh: true, q: '', type: 'DRAFT' });

        goBack(MOUNT, navigation, { route: ROUTES.MAIN_MORE })

        return () => goBack(UNMOUNT)
    }, []);

    const onSetActiveTab = (tab) => {
        setFilter(false)

        if (!refreshing) {
            const type = getActiveTab(tab)

            getItems({ fresh: true, type, q: search });

            setActiveTab(tab);
        }
    };

    const getItems = ({ fresh = false, onResult, type, params, q = '', resetFilter = false } = {}) => {
        if (refreshing) {
            return;
        }

        if (resetFilter)
            setFilter(false)

        setRefreshing(true);
        setFresh(fresh);

        const paginationParams = fresh ? { ...pagination, page: 1 } : pagination;

        if (!fresh && paginationParams.lastPage < paginationParams.page) {
            return;
        }

        getEstimates({
            fresh,
            type,
            pagination: paginationParams,
            params: { ...params, search: q },
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

    const onEstimateSelect = (estimate) => {
        navigation.navigate(ROUTES.ESTIMATE, { id: estimate.id, type: ESTIMATE_EDIT })
        onResetFilter(ESTIMATES_TABS.ALL)
        onSetActiveTab(ESTIMATES_TABS.ALL)
    };

    const onSearch = (keywords) => {
        const type = getActiveTab()
        setSearch(keywords)
        getItems({ fresh: true, q: keywords, type })
    };

    const getActiveTab = (activeTab = state.activeTab) => {
        let type = '';

        if (activeTab == ESTIMATES_TABS.SENT) {
            type = 'SENT';
        } else if (activeTab == ESTIMATES_TABS.DRAFT) {
            type = 'DRAFT';
        }
        return type
    }

    const setFormField = (field, value) => {
        props.dispatch(change(ESTIMATE_SEARCH, field, value));
    };

    const onResetFilter = (tab = '') => {
        setFilter(false)

        if (filter && !tab) {
            getItems({ fresh: true, q: '', type: getActiveTab() });
        }
    }

    const onSubmitFilter = ({ filterStatus = '', from_date = '', to_date = '', estimate_number = '', customer_id = '' }) => {
        if (filterStatus || from_date || to_date || estimate_number || customer_id) {

            if (filterStatus === ESTIMATES_TABS.SENT)
                setActiveTab(ESTIMATES_TABS.SENT);
            else if (filterStatus === ESTIMATES_TABS.DRAFT)
                setActiveTab(ESTIMATES_TABS.DRAFT);
            else
                setActiveTab(ESTIMATES_TABS.ALL);

            setFilter(false)

            getItems({
                fresh: true,
                params: {
                    ...params,
                    customer_id,
                    estimate_number,
                    from_date,
                    to_date,
                },
                type: filterStatus,
            });
            return;
        }

        onResetFilter();
    }

    const loadMoreItems = ({ type, q }) => {
        if (!filter) {
            getItems({ type, q });
            return;
        }

        getItems({
            params: {
                ...params,
                customer_id,
                estimate_number,
                from_date,
                to_date,
            },
            type: filterStatus,
            filter: true
        });
    }

    const onAddEstimate = () => {
        onSetActiveTab(ESTIMATES_TABS.ALL)
        onResetFilter(ESTIMATES_TABS.ALL)
        navigation.navigate(ROUTES.ESTIMATE, { type: ESTIMATE_ADD })
    }

    const {
        lastPage,
        page,
    } = pagination;

    const canLoadMore = lastPage >= page;

    let estimateItem = [];
    typeof estimates !== 'undefined' && (estimateItem = estimates);

    let selectFields = [
        {
            name: "customer_id",
            apiSearch: true,
            hasPagination: true,
            getItems: getCustomers,
            items: customers,
            displayName: "name",
            label: Lng.t("estimates.customer", { locale: language }),
            icon: 'user',
            placeholder: Lng.t("customers.placeholder", { locale: language }),
            navigation: navigation,
            compareField: "id",
            onSelect: (item) => setFormField('customer_id', item.id),
            headerProps: {
                title: Lng.t("customers.title", { locale: language }),
                rightIconPress: null
            },
            listViewProps: {
                hasAvatar: true,
            },
            emptyContentProps: {
                contentType: "customers",
                image: IMAGES.EMPTY_CUSTOMERS,
            }
        }
    ]

    let datePickerFields = [
        {
            name: "from_date",
            label: Lng.t("estimates.fromDate", { locale: language }),
            onChangeCallback: (formDate, displayDate) => {
                setSelectedFromDate(displayDate);
                setSelectedFromDateValue(formDate);
            },
            selectedDate: selectedFromDate,
            selectedDateValue: selectedFromDateValue
        },
        {
            name: "to_date",
            label: Lng.t("estimates.toDate", { locale: language }),
            onChangeCallback: (formDate, displayDate) => {
                setSelectedToDate(displayDate);
                setSelectedToDateValue(formDate);
            },
            selectedDate: selectedToDate,
            selectedDateValue: selectedToDateValue
        }
    ]

    let inputFields = [{
        name: 'estimate_number',
        hint: Lng.t("estimates.estimateNumber", { locale: language }),
        inputProps: {
            autoCapitalize: 'none',
            autoCorrect: true,
        }
    }]

    let dropdownFields = [{
        name: "filterStatus",
        label: Lng.t("estimates.status", { locale: language }),
        fieldIcon: 'align-center',
        items: FILTER_ESTIMATE_STATUS,
        onChangeCallback: (val) => {
            setFormField('filterStatus', val)
        },
        defaultPickerOptions: {
            label: Lng.t("estimates.statusPlaceholder", { locale: language }),
            value: '',
        },
        containerStyle: styles.selectPicker
    }]

    return (
        <View style={styles.container}>
            <MainLayout
                headerProps={{
                    title: Lng.t("header.estimates", { locale: language }),
                    leftIcon: "long-arrow-alt-left",
                    leftIconPress: () => navigation.navigate(ROUTES.MAIN_MORE),
                    title: Lng.t("header.estimates", { locale: language }),
                    titleStyle: styles.headerTitle,
                    placement: "center",
                    rightIcon: "plus",
                    rightIconPress: () => {
                        onAddEstimate()
                    },
                }}
                onSearch={onSearch}
                filterProps={{
                    onSubmitFilter: handleSubmit(onSubmitFilter),
                    selectFields: selectFields,
                    datePickerFields: datePickerFields,
                    inputFields: inputFields,
                    dropdownFields: dropdownFields,
                    clearFilter: props,
                    onResetFilter: () => onResetFilter()
                }}
            >
                <Tabs
                    style={styles.Tabs}
                    activeTab={activeTab}
                    setActiveTab={onSetActiveTab}
                    tabs={[
                        {
                            Title: ESTIMATES_TABS.DRAFT,
                            tabName: TAB_NAME(ESTIMATES_TABS.DRAFT, language, Lng),
                            render: (
                                <Draft
                                    estimates={estimateItem}
                                    getEstimates={getItems}
                                    canLoadMore={canLoadMore}
                                    onEstimateSelect={onEstimateSelect}
                                    loading={loading}
                                    refreshing={refreshing}
                                    search={search}
                                    navigation={navigation}
                                    language={language}
                                    loadMoreItems={loadMoreItems}
                                    onAddEstimate={onAddEstimate}
                                    fresh={fresh}
                                    filter={filter}
                                />
                            ),
                        },
                        {
                            Title: ESTIMATES_TABS.SENT,
                            tabName: TAB_NAME(ESTIMATES_TABS.SENT, language, Lng),
                            render: (
                                <Sent
                                    estimates={estimateItem}
                                    getEstimates={getItems}
                                    canLoadMore={canLoadMore}
                                    onEstimateSelect={onEstimateSelect}
                                    loading={loading}
                                    refreshing={refreshing}
                                    fresh={fresh}
                                    search={search}
                                    navigation={navigation}
                                    language={language}
                                    loadMoreItems={loadMoreItems}
                                    onAddEstimate={onAddEstimate}
                                    filter={filter}
                                />
                            ),
                        },
                        {
                            Title: ESTIMATES_TABS.ALL,
                            tabName: TAB_NAME(ESTIMATES_TABS.ALL, language, Lng),
                            render: (
                                <All
                                    estimates={estimateItem}
                                    getEstimates={getItems}
                                    canLoadMore={canLoadMore}
                                    onEstimateSelect={onEstimateSelect}
                                    loading={loading}
                                    refreshing={refreshing}
                                    fresh={fresh}
                                    search={search}
                                    navigation={navigation}
                                    language={language}
                                    loadMoreItems={loadMoreItems}
                                    onAddEstimate={onAddEstimate}
                                    filter={filter}
                                />
                            ),
                        },
                    ]}
                />
            </MainLayout>
        </View>
    );
}
