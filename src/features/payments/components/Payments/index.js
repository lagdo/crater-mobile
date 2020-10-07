// @flow
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import { change } from 'redux-form';
import styles from './styles';
import {
    MainLayout,
    ListView
} from '../../../../components';
import { ROUTES } from '../../../../navigation/routes';
import { IMAGES } from '../../../../config';
import Lng from '../../../../api/lang/i18n';
import { PAYMENT_ADD, PAYMENT_EDIT, PAYMENT_SEARCH } from '../../constants';
import { formatSelectPickerName } from '../../../../api/global';

let params = {
    search: '',
    payment_method_id: '',
    payment_number: '',
    customer_id: '',
}

type IProps = {
    navigation: Object,
    getPayments: Function,
    payments: Object,
    loading: Boolean,
    getCustomers: Function,
}

export const Payments = (props: IProps) => {
    const {
        navigation,
        loading,
        handleSubmit,
        payments,
        filterPayments,
        getPayments,
        customers,
        getCustomers,
        paymentModesLoading,
        paymentMethods,
        getPaymentModes,
        formValues: {
            customer_id = '',
            payment_method_id = '',
            payment_number = ''
        },
    } = props;

    const [refreshing, setRefreshing] = useState(false);
    const [fresh, setFresh] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        lastPage: 1,
    });
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState(false);
    const [selectedPaymentMode, setSelectedPaymentMode] = useState('');

    useEffect(() => {
        getItems({ fresh: true });
        getPaymentModes()
    }, []);

    const onPaymentSelect = (payment) => {
        navigation.navigate(ROUTES.PAYMENT,
            { paymentId: payment.id, type: PAYMENT_EDIT }
        )
        onResetFilter()
    }

    const onSearch = (keywords) => {
        onResetFilter()
        setSearch(keywords)
        getItems({ fresh: true, params: { ...params, search: keywords } })
    };

    const setFormField = (field, value) => {
        props.dispatch(change(PAYMENT_SEARCH, field, value));

        if (field === 'payment_method_id')
            setSelectedPaymentMode(value)
    };

    const getItems = ({ fresh = false, onResult, params, filter = false } = {}) => {
        if (refreshing) {
            return;
        }

        setRefreshing(true);
        setFresh(fresh);

        const paginationParams = fresh ? { ...pagination, page: 1 } : pagination;

        if (!fresh && paginationParams.lastPage < paginationParams.page) {
            return;
        }

        getPayments({
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

    const onResetFilter = () => {
        setFilter(false)
    }

    const onSubmitFilter = ({ customer_id = '', payment_method_id = '', payment_number = '' }) => {
        if (customer_id || payment_method_id || payment_number) {
            setFilter(false)

            getItems({
                fresh: true,
                params: {
                    ...params,
                    customer_id,
                    payment_method_id,
                    payment_number,
                },
                filter: true
            })
            return;
        }

        onResetFilter();
    }

    const getPaymentsList = (payments) => {
        let paymentList = []
        if (typeof payments !== 'undefined' && payments.length != 0) {
            paymentList = payments.map((payment) => {
                const {
                    notes,
                    formattedPaymentDate,
                    amount,
                    payment_mode,
                    user: { name, currency }
                } = payment;

                return {
                    title: `${name}`,
                    subtitle: {
                        title: `${payment_mode ? '(' + payment_mode + ')' : ''}`,
                    },
                    amount,
                    currency,
                    rightSubtitle: formattedPaymentDate,
                    fullItem: payment,
                };
            });
        }
        return paymentList
    }

    const loadMoreItems = () => {
        if (!filter) {
            getItems({ params: { ...params, search } });
            return;
        }

        getItems({
            params: {
                ...params,
                customer_id,
                payment_method_id,
                payment_number,
            },
            filter: true
        });
    }

    const {
        lastPage,
        page,
    } = pagination;

    const canLoadMore = lastPage >= page;

    let paymentsItem = getPaymentsList(payments)
    let filterPaymentItem = getPaymentsList(filterPayments)

    let filterRefs = {}

    let selectFields = [
        {
            name: "customer_id",
            apiSearch: true,
            hasPagination: true,
            getItems: getCustomers,
            items: customers,
            displayName: "name",
            label: Lng.t("payments.customer"),
            icon: 'user',
            placeholder: Lng.t("customers.placeholder"),
            navigation: navigation,
            compareField: "id",
            onSelect: (item) => setFormField('customer_id', item.id),
            headerProps: {
                title: Lng.t("customers.title"),
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

    let inputFields = [{
        name: 'payment_number',
        hint: Lng.t("payments.number"),
        leftIcon: 'hashtag',
        inputProps: {
            autoCapitalize: 'none',
            autoCorrect: true,
        },
        refLinkFn: (ref) => {
            filterRefs.paymentNumber = ref;
        }
    }]

    let dropdownFields = [{
        name: "payment_method_id",
        label: Lng.t("payments.mode"),
        fieldIcon: 'align-center',
        items: formatSelectPickerName(paymentMethods),
        onChangeCallback: (val) => {
            setFormField('payment_method_id', val)
        },
        defaultPickerOptions: {
            label: Lng.t("payments.modePlaceholder"),
            value: '',
        },
        selectedItem: selectedPaymentMode,
        onDonePress: () => filterRefs.paymentNumber.focus(),
        containerStyle: styles.selectPicker
    }]

    let empty = (!filter && !search) ? {
        description: Lng.t("payments.empty.description"),
        buttonTitle: Lng.t("payments.empty.buttonTitle"),
        buttonPress: () => {
            navigation.navigate(ROUTES.PAYMENT, { type: PAYMENT_ADD })
            onResetFilter()
        }
    } : {}

    let emptyTitle = search ? Lng.t("search.noResult", { search })
        : (!filter) ? Lng.t("payments.empty.title") :
            Lng.t("filter.empty.filterTitle")

    return (
        <View style={styles.container}>
            <MainLayout
                headerProps={{
                    rightIcon: "plus",
                    rightIconPress: () => {
                        navigation.navigate(ROUTES.PAYMENT, { type: PAYMENT_ADD })
                        onResetFilter()
                    },
                    title: Lng.t("header.payments")
                }}
                onSearch={onSearch}
                bottomDivider
                filterProps={{
                    onSubmitFilter: handleSubmit(onSubmitFilter),
                    selectFields: selectFields,
                    inputFields: inputFields,
                    dropdownFields: dropdownFields,
                    clearFilter: props,
                    onResetFilter: () => onResetFilter()
                }}
                loadingProps={{ is: paymentModesLoading || (loading && fresh) }}
            >

                <View style={styles.listViewContainer}>

                    <ListView
                        items={!filter ? paymentsItem : filterPaymentItem}
                        onPress={onPaymentSelect}
                        refreshing={refreshing}
                        loading={loading}
                        isEmpty={!filter ? paymentsItem.length <= 0 :
                            filterPaymentItem.length <= 0
                        }
                        canLoadMore={canLoadMore}
                        getFreshItems={(onHide) => {
                            onResetFilter()
                            getItems({
                                fresh: true,
                                onResult: onHide,
                                params: { ...params, search }
                            });
                        }}
                        getItems={() => {
                            loadMoreItems()
                        }}
                        contentContainerStyle={{ flex: 0 }}
                        bottomDivider
                        emptyContentProps={{
                            title: emptyTitle,
                            image: IMAGES.EMPTY_PAYMENTS,
                            ...empty
                        }}
                    />

                </View>
            </MainLayout>
        </View >
    );
}
