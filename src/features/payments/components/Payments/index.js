// @flow
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import styles from './styles';
import {
    MainLayout,
    ListView
} from '../../../../components';
import { ROUTES } from '../../../../navigation/routes';
import { IMAGES } from '../../../../config';
import Lng from '../../../../api/lang/i18n';
import { PAYMENT_ADD, PAYMENT_EDIT } from '../../constants';
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
        payments,
        filterPayments,
        getPayments,
        customers,
        getCustomers,
        paymentModesLoading,
        paymentMethods,
        getPaymentModes,
    } = props;

    const [refreshing, setRefreshing] = useState(false);
    const [fresh, setFresh] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, lastPage: 1 });
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState(false);

    const [customer_id, setCustomerId] = useState('');
    const [payment_method_id, setPaymentMethodId] = useState('');
    const [payment_number, setPaymentNumber] = useState('');

    useEffect(() => {
        getItems({ fresh: true });
        getPaymentModes()
    }, []);

    const onPaymentSelect = (payment) => {
        navigation.navigate(ROUTES.PAYMENT, { paymentId: payment.id, type: PAYMENT_EDIT });
        onResetFilter();
    };

    const onAddPayment = () => {
        navigation.navigate(ROUTES.PAYMENT, { type: PAYMENT_ADD });
        onResetFilter();
    };

    const onSearch = (keywords) => {
        onResetFilter()
        setSearch(keywords)
        getItems({ fresh: true, params: { ...params, search: keywords } })
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

    const onResetFilter = () => setFilter(false);

    const onSubmitFilter = ({ customer_id = '', payment_method_id = '', payment_number = '' }) => {
        if (customer_id || payment_method_id || payment_number) {
            setFilter(true);

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
            onSelect: (item) => setCustomerId(item.id),
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
            onChangeText: (val) => setPaymentNumber(val),
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
        onChangeCallback: (val) => setPaymentMethodId(val),
        defaultPickerOptions: {
            label: Lng.t("payments.modePlaceholder"),
            value: '',
        },
        selectedItem: payment_method_id,
        onDonePress: () => filterRefs.paymentNumber.focus(),
        containerStyle: styles.selectPicker
    }]

    let empty = (!filter && !search) ? {
        description: Lng.t("payments.empty.description"),
        buttonTitle: Lng.t("payments.empty.buttonTitle"),
        buttonPress: onAddPayment
    } : {};

    let emptyTitle = search ? Lng.t("search.noResult", { search })
        : (!filter) ? Lng.t("payments.empty.title") :
            Lng.t("filter.empty.filterTitle");

    return (
        <View style={styles.container}>
            <MainLayout
                headerProps={{
                    rightIcon: "plus",
                    rightIconPress: onAddPayment,
                    title: Lng.t("header.payments")
                }}
                onSearch={onSearch}
                bottomDivider
                filterProps={{
                    onSubmitFilter: onSubmitFilter,
                    selectFields: selectFields,
                    inputFields: inputFields,
                    dropdownFields: dropdownFields,
                    clearFilter: props,
                    onResetFilter: onResetFilter
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
                        getItems={loadMoreItems}
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
