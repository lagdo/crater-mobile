import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ListItem, Avatar, CheckBox } from 'react-native-elements';
import { styles } from './styles';
import { InfiniteScroll } from '../InfiniteScroll';
import { Empty } from '../Empty';
import { fonts } from '~/styles/fonts';
import { colors } from '~/styles/colors';
import { CurrencyFormat } from '../CurrencyFormat';

type IProps = {
    loading: Boolean,
    onRefresh: Function,
    refreshing: Boolean,
    hasAvatar: Boolean,
    getItems: Function,
    getFreshItems: Function,
    canLoadMore: Boolean,
    isEmpty: Boolean,
    containerStyle: Object,
    emptyContentProps: Object,
    rightTitleStyle: Object,
    leftTitleStyle: Object,
    leftSubTitleLabelStyle: Object,
    listItemProps: Object,
    backgroundColor: String,
    compareField: String,
    checkedItems: Array,
    listViewContainerStyle: Object,
};

export const ListView = (props: IProps) => {
    const {
        items,
        loading = false,
        refreshing = true,
        hasAvatar = false,
        getItems,
        getFreshItems,
        canLoadMore,
        isEmpty,
        containerStyle,
        emptyContentProps,
        listViewContainerStyle,
        leftTitleStyle,
        compareField,
        checkedItems,
        valueCompareField,
        leftSubTitleLabelStyle,
        leftSubTitleStyle,
        onPress,
        bottomDivider = false,
        rightTitleStyle,
        backgroundColor,
        itemContainer,
        listItemProps,
        hasCheckbox,
        contentContainerStyle,
        leftIconStyle,
    } = props;

    const leftTitle = (title) => {
        return (
            <Text numberOfLines={1} style={[styles.leftTitle, leftTitleStyle && leftTitleStyle]}>
                {title}
            </Text>
        );
    };

    const getCheckedItem = (item) => {
        if (checkedItems) {
            return checkedItems.filter(
                val => val[valueCompareField] === item.fullItem[compareField]
            ).length > 0;
        }

        return false;
    }

    const leftSubTitle = ({ title, label, labelBgColor, labelTextColor, labelComponent } = {}) => {
        if (!title && !label && !labelComponent) {
            return;
        }

        return (
            <View style={styles.leftSubTitleContainer}>
                <Text
                    style={[
                        styles.leftSubTitleText,
                        leftSubTitleStyle && leftSubTitleStyle
                    ]}
                    numberOfLines={3}
                >
                    {title}
                </Text>

                {(label || labelComponent) && (
                    <View style={styles.leftSubTitleLabelContainer}>
                        <View
                            style={[
                                styles.labelInnerContainerStyle,
                                { backgroundColor: labelBgColor }
                            ]}
                        >
                            {labelComponent ? labelComponent : (
                                    <Text
                                        style={[
                                            { color: labelTextColor },
                                            styles.leftSubTitleLabel,
                                            leftSubTitleLabelStyle && leftSubTitleLabelStyle,
                                        ]}
                                    >
                                        {label}
                                    </Text>
                                )
                            }
                        </View>
                    </View>
                )}
            </View>
        );
    };

    const itemsList = (item, index) => {
        return (
            <ListItem
                key={index}
                title={leftTitle(item.title)}
                subtitle={leftSubTitle(item.subtitle)}
                rightTitle={
                    item.amount ? (
                        <CurrencyFormat
                            amount={item.amount}
                            currency={item.currency}
                            style={[
                                styles.rightTitle,
                                rightTitleStyle && rightTitleStyle
                            ]}
                        />
                    ) : item.rightTitle
                }
                rightSubtitle={item.rightSubtitle}
                bottomDivider={bottomDivider}
                rightTitleStyle={[
                    styles.rightTitle,
                    rightTitleStyle && rightTitleStyle
                ]}
                rightSubtitleStyle={styles.rightSubTitle}
                contentContainerStyle={[
                    styles.contentContainer,
                    contentContainerStyle
                ]}
                rightContentContainerStyle={styles.rightContentContainer}
                containerStyle={[
                    styles.containerStyle,
                    {
                        backgroundColor:
                            (backgroundColor && backgroundColor) || colors.veryLightGray,
                    },
                    itemContainer && itemContainer,
                ]}
                leftElement={hasCheckbox && (
                    <CheckBox
                        checkedIcon='check-square'
                        containerStyle={[
                            styles.checkboxContainerStyle,
                        ]}
                        size={20}
                        checkedColor={colors.primary}
                        uncheckedColor={colors.lightGray}
                        checked={getCheckedItem(item)}
                        onPress={() => onPress(item.fullItem)}
                    />
                )}
                fontFamily={fonts.poppins}
                onPress={() => onPress(item.fullItem)}
                onLongPress={() => onPress(item.fullItem)}
                {...listItemProps}
            />
        );
    };

    const itemsWithAvatar = (item, index) => {
        const { title, subtitle, fullItem, leftAvatar, leftIcon, leftIconSolid = false, iconSize = 22 } = item;

        return (
            <ListItem
                key={index}
                title={leftTitle(title)}
                subtitle={leftSubTitle(subtitle)}
                bottomDivider={bottomDivider}
                containerStyle={[
                    styles.containerWithAvatar,
                    { backgroundColor: colors.veryLightGray },
                    itemContainer && itemContainer
                ]}
                fontFamily={fonts.poppins}
                onPress={() => onPress(fullItem)}
                leftAvatar={
                    leftAvatar ? (
                        <Avatar
                            size={40}
                            rounded
                            title={leftAvatar}
                            overlayContainerStyle={{
                                backgroundColor: leftIcon ? 'transparent' : colors.gray,
                            }}
                        />
                    ) : (
                            <Icon
                                name={leftIcon}
                                size={iconSize}
                                color={colors.primaryLight}
                                solid={leftIconSolid}
                                style={leftIconStyle && leftIconStyle}
                            />
                        )}
                {...listItemProps}
            />
        );
    };

    return (
        <InfiniteScroll
            loading={loading}
            isEmpty={isEmpty}
            canLoadMore={canLoadMore}
            style={listViewContainerStyle && listViewContainerStyle}
            onEndReached={getItems}
            refreshControlColor={colors.veryDarkGray}
            onPullToRefresh={refreshing ? (onHide) => onHide && onHide() : getFreshItems}
        >
            {!isEmpty
                ? items.map((item, index) =>
                    !hasAvatar
                        ? itemsList(item, index)
                        : itemsWithAvatar(item, index),
                )
                : !loading && <Empty {...emptyContentProps} />}
        </InfiniteScroll>
    );
}

export default ListView;
