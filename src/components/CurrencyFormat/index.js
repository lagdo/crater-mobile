import React from 'react';
import { View, Text } from 'react-native';
import { formatMoney } from '~/api/helper';
import { styles, SymbolStyle } from './styles';

type IProps = {
    style: Object,
    amount: String,
    currency: Object,
    preText: String,
    containerStyle: Object,
    currencyStyle: Object
};
export const CurrencyFormat = (props: IProps) => {
    const {
        style,
        amount,
        currency,
        preText,
        containerStyle,
        currencyStyle,
    } = props;
    const { symbol, money } = formatMoney(amount, currency);

    return (
        <View style={[styles.container, containerStyle && containerStyle]}>
            <Text style={style && style}>
                {preText && preText}
            </Text>
            <Text style={style && style}>{money}</Text>
            <Text
                style={[
                    style && style,
                    currencyStyle && currencyStyle,
                    SymbolStyle,
                ]}
            >
                {' '}
                {symbol}
            </Text>
        </View>
    );
}
