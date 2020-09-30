// @flow

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { change } from 'redux-form';
import styles from './styles';
import { Tabs, MainLayout } from '../../../../components';
import Due from '../Tab/Due';
import Draft from '../Tab/Draft';
import All from '../Tab/All';

import { ROUTES } from '../../../../navigation/routes';
import {
    INVOICES_TABS,
    INVOICE_ADD,
    INVOICE_EDIT,
    INVOICE_SEARCH,
    FILTER_INVOICE_STATUS,
    TAB_NAME,
    FILTER_INVOICE_PAID_STATUS,
} from '../../constants';
import Lng from '../../../../api/lang/i18n';
import { IMAGES } from '../../../../config';
import { goBack, MOUNT } from '../../../../navigation/actions';

let params = {
    search: '',
    customer_id: '',
    invoice_number: '',
    from_date: '',
    to_date: '',
}

type IProps = {
    language: String,
    navigation: Object,
    invoices: Object,
    customers: Object,
    loading: Boolean,
    handleSubmit: Function,
    getCustomers: Function,
}

export const Invoices = (props: IProps) => {
    const {
        navigation,
        language,
        loading,
        handleSubmit,
        invoices,
        getInvoices,
        customers,
        getCustomers,
        formValues: {
            filterStatus = '',
            paid_status = '',
            from_date = '',
            to_date = '',
            invoice_number = '',
            customer_id = '',
        },
    } = props

    const [activeTab, setActiveTab] = useState(INVOICES_TABS.DUE);
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
        getItems({ fresh: true, q: '', type: 'UNPAID' });
        goBack(MOUNT, navigation, { exit: true })
    }, []);

    const onSetActiveTab = (tab) => {
        setFilter(false)

        if (!refreshing) {
            const type = getActiveTab(tab)

            getItems({ fresh: true, type, q: search });

            setActiveTab(tab);

            props.setInvoiceActiveTab({ activeTab: type })
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

        getInvoices({
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

    const setFormField = (field, value) => {
        props.dispatch(change(INVOICE_SEARCH, field, value));
    };

    const onInvoiceSelect = (invoice) => {
        onSetActiveTab(INVOICES_TABS.ALL)
        onResetFilter(INVOICES_TABS.ALL)
        navigation.navigate(ROUTES.INVOICE,
            { id: invoice.id, type: INVOICE_EDIT }
        )
    };

    const onSearch = (keywords) => {
        const type = getActiveTab()
        setSearch(keywords)
        getItems({ fresh: true, type, q: keywords })
    };

    const getActiveTab = (activeTab = state.activeTab) => {
        let type = '';

        if (activeTab == INVOICES_TABS.DUE) {
            type = 'UNPAID';
        } else if (activeTab == INVOICES_TABS.DRAFT) {
            type = 'DRAFT';
        }
        return type
    }

    const getFilterStatusType = (filterType) => {
        let type = filterType
        if (type === INVOICES_TABS.DUE)
            type = 'UNPAID'
        return type
    }

    const onResetFilter = (tab = '') => {
        setFilter(false)

        if (filter && !tab) {
            getItems({ fresh: true, q: '', type: getActiveTab() });
        }
    }

    const onSubmitFilter = ({ filterStatus = '', paid_status = '', from_date = '', to_date = '', invoice_number = '', customer_id = '' }) => {
        if (filterStatus || paid_status || from_date || to_date || invoice_number || customer_id) {

            if (filterStatus === INVOICES_TABS.DUE)
                setActiveTab(INVOICES_TABS.DUE);
            else if (filterStatus === INVOICES_TABS.DRAFT)
                setActiveTab(INVOICES_TABS.DRAFT);
            else
                setActiveTab(INVOICES_TABS.ALL);

            setFilter(false)

            getItems({
                fresh: true,
                params: {
                    ...params,
                    customer_id,
                    invoice_number,
                    from_date,
                    to_date
                },
                type: filterStatus ? getFilterStatusType(filterStatus) : paid_status,
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
                invoice_number,
                from_date,
                to_date
            },
            type: filterStatus ? getFilterStatusType(filterStatus) : paid_status,
            filter: true
        });
    }

    const onAddInvoice = () => {
        onSetActiveTab(INVOICES_TABS.ALL)
        onResetFilter(INVOICES_TABS.ALL)
        navigation.navigate(ROUTES.INVOICE, { type: INVOICE_ADD })
    }

    const {
        lastPage,
        page,
    } = pagination;

    const canLoadMore = lastPage >= page;

    let filterRefs = {}

    let selectFields = [
        {
            name: "customer_id",
            apiSearch: true,
            hasPagination: true,
            getItems: getCustomers,
            items: customers,
            displayName: "name",
            label: Lng.t("invoices.customer", { locale: language }),
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
            label: Lng.t("invoices.fromDate", { locale: language }),
            onChangeCallback: (formDate, displayDate) => {
                setSelectedFromDate(displayDate);
                setSelectedFromDateValue(formDate);
            },
            selectedDate: selectedFromDate,
            selectedDateValue: selectedFromDateValue

        },
        {
            name: "to_date",
            label: Lng.t("invoices.toDate", { locale: language }),
            onChangeCallback: (formDate, displayDate) => {
                setSelectedToDate(displayDate);
                setSelectedToDateValue(formDate);
            },
            selectedDate: selectedToDate,
            selectedDateValue: selectedToDateValue
        }
    ]

    let inputFields = [{
        name: 'invoice_number',
        hint: Lng.t("invoices.invoiceNumber", { locale: language }),
        leftIcon: 'hashtag',
        inputProps: {
            autoCapitalize: 'none',
            autoCorrect: true,
        },
        refLinkFn: (ref) => {
            filterRefs.invNumber = ref;
        }
    }]

    let dropdownFields = [
        {
            name: "filterStatus",
            label: Lng.t("invoices.status", { locale: language }),
            fieldIcon: 'align-center',
            items: FILTER_INVOICE_STATUS,
            onChangeCallback: (val) => {
                setFormField('filterStatus', val)
            },
            defaultPickerOptions: {
                label: Lng.t("invoices.statusPlaceholder", { locale: language }),
                value: '',
            },
            containerStyle: styles.selectPicker
        },
        {
            name: "paid_status",
            label: Lng.t("invoices.paidStatus", { locale: language }),
            fieldIcon: 'align-center',
            items: FILTER_INVOICE_PAID_STATUS,
            onChangeCallback: (val) => {
                setFormField('paid_status', val)
            },
            defaultPickerOptions: {
                label: Lng.t("invoices.paidStatusPlaceholder", { locale: language }),
                value: '',
            },
            onDonePress: () => filterRefs.invNumber.focus(),
            containerStyle: styles.selectPicker
        }
    ]

    return (
        <View style={styles.container}>
            <MainLayout
                headerProps={{
                    rightIcon: 'plus',
                    rightIconPress: () => {
                        onAddInvoice()
                    },
                    title: Lng.t("header.invoices", { locale: language }),
                }}
                onSearch={onSearch}
                filterProps={{
                    onSubmitFilter: handleSubmit(onSubmitFilter),
                    selectFields: selectFields,
                    datePickerFields: datePickerFields,
                    inputFields: inputFields,
                    dropdownFields: dropdownFields,
                    clearFilter: props,
                    language: language,
                    onResetFilter: () => onResetFilter()
                }}
            >
                <Tabs
                    style={styles.Tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tabs={[
                        {
                            Title: INVOICES_TABS.DUE,
                            tabName: TAB_NAME(INVOICES_TABS.DUE, language, Lng),
                            render: (
                                <Due
                                    invoices={invoices}
                                    getInvoices={getItems}
                                    canLoadMore={canLoadMore}
                                    onInvoiceSelect={onInvoiceSelect}
                                    loading={loading}
                                    refreshing={refreshing}
                                    fresh={fresh}
                                    search={search}
                                    navigation={navigation}
                                    language={language}
                                    loadMoreItems={loadMoreItems}
                                    onAddInvoice={onAddInvoice}
                                    filter={filter}
                                />
                            ),
                        },
                        {
                            Title: INVOICES_TABS.DRAFT,
                            tabName: TAB_NAME(INVOICES_TABS.DRAFT, language, Lng),
                            render: (
                                <Draft
                                    invoices={invoices}
                                    getInvoices={getItems}
                                    canLoadMore={canLoadMore}
                                    onInvoiceSelect={onInvoiceSelect}
                                    loading={loading}
                                    refreshing={refreshing}
                                    search={search}
                                    navigation={navigation}
                                    language={language}
                                    loadMoreItems={loadMoreItems}
                                    onAddInvoice={onAddInvoice}
                                    fresh={fresh}
                                    filter={filter}
                                />
                            ),
                        },
                        {
                            Title: INVOICES_TABS.ALL,
                            tabName: TAB_NAME(INVOICES_TABS.ALL, language, Lng),
                            render: (
                                <All
                                    invoices={invoices}
                                    getInvoices={getItems}
                                    canLoadMore={canLoadMore}
                                    onInvoiceSelect={onInvoiceSelect}
                                    loading={loading}
                                    refreshing={refreshing}
                                    fresh={fresh}
                                    search={search}
                                    navigation={navigation}
                                    language={language}
                                    loadMoreItems={loadMoreItems}
                                    onAddInvoice={onAddInvoice}
                                    filter={filter}
                                />
                            ),
                        },
                    ]}
                />
            </MainLayout>
        </View >
    );
}
