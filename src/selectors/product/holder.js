import React, { useMemo } from 'react';
import styles from '~/styles/currency';
import { CurrencyFormat } from '~/components';

const formatItem = (item, currency) => {
    const { name, description, price, quantity, total } = item;

    return {
        title: name,
        subtitle: {
            title: description,
            labelComponent: (
                <CurrencyFormat
                    amount={price}
                    currency={currency}
                    preText={`${quantity} * `}
                    style={styles.itemLeftSubTitle}
                    containerStyle={styles.itemLeftSubTitleLabel}
                />
            ),
        },
        amount: total,
        currency,
        fullItem: item,
    };
};

const formatAvailableItem = (item, currency) => {
    const { name, description, price } = item;

    return {
        title: name,
        subtitle: {
            title: description,
        },
        amount: price,
        currency,
        fullItem: item,
    };
};

const getTaxEntry = (tax, amount) => {
    return {
        ...tax,
        label: `${tax.name} (${tax.percent} %)`,
        amount: (tax.percent * amount) / 100,
    };
};

const getTaxAmount = (taxes) => {
    return taxes.reduce((total, tax) => total += tax.amount, 0);
};

export const useProductHolder = (values, items, allItems) => {
    const {
        taxes = [],
        currency = null,
        discount = 0,
        discount_type = 'none',
    } = values || {};

    // Selected items
    const selectedItems = useMemo(() => {
        return items ? items.map((item) => formatItem(item, currency)) : [];
    }, [items, currency]);

    // Available items
    const availableItems = useMemo(() => {
        return allItems ? allItems.filter((item) =>
            !items.find((selected) => item.id === selected.id))
            .map((item) => formatAvailableItem(item, currency)) : [];
    }, [selectedItems]);

    // Gross amount
    const grossAmount = useMemo(() => {
        return items ? items.reduce((total, item) =>
            total += item.price * item.quantity, 0) : 0;
    }, [items]);

    // Discount on items
    const itemsDiscount = useMemo(() => {
        return items ? items.reduce((total, item) => total += item.discount, 0) : 0;
    }, [items]);

    // Discount on gross amount
    const totalDiscount = useMemo(() => {
        if (discount_type === 'percentage') {
            // Discount is a percentage of the total amount
            return ((discount * grossAmount) / 100);
        }
        // Absolute discount value is converted to cents
        return (discount * 100);
    }, [discount_type, discount, grossAmount]);

    // Taxes on all items with total amounts
    const itemTaxes = useMemo(() => {
        const taxList = [];
        items.forEach(item => {
            item.taxes.forEach(tax => {
                const itemTax = taxList.find(pTax => pTax.id === tax.id);
                if (itemTax) {
                    // Add the tax amount to the item tax
                    itemTax.amount += tax.amount;
                    return;
                }
                // Push the tax in the item taxes list
                taxList.push(tax);
            });
        });
        return taxList;
    }, [items]);

    // Taxes on items only (tax per item)
    const itemTaxAmount = useMemo(() => {
        return getTaxAmount(itemTaxes);
    }, [itemTaxes]);

    // Sub total: with discount and without taxes
    const subTotalAmount = useMemo(() => {
        return grossAmount + itemTaxAmount - totalDiscount;
    }, [grossAmount, itemTaxAmount, totalDiscount]);

    // Simple taxes apply on sub total
    const simpleTaxes = useMemo(() => {
        return taxes.filter(tax => !tax.compound).map(tax => getTaxEntry(tax, subTotalAmount));
    }, [taxes, subTotalAmount]);

    // Simple taxes amount
    const simpleTaxAmount = useMemo(() => {
        return getTaxAmount(simpleTaxes);
    }, [simpleTaxes]);

    // The total amount: sub total and simple taxes
    const totalAmount = useMemo(() => {
        return subTotalAmount + simpleTaxAmount;
    }, [subTotalAmount, simpleTaxAmount]);

    // The compound taxes list
    const compoundTaxes = useMemo(() => {
        return taxes.filter(tax => tax.compound).map(tax => getTaxEntry(tax, totalAmount));
    }, [taxes, totalAmount]);

    // The compound taxes amount
    const compoundTaxAmount = useMemo(() => {
        return getTaxAmount(compoundTaxes);
    }, [compoundTaxes]);

    // All the taxes amount
    const totalTaxAmount = useMemo(() => {
        return itemTaxAmount + simpleTaxAmount + compoundTaxAmount;
    }, [itemTaxAmount, simpleTaxAmount, compoundTaxAmount]);

    // The final amount to be paid
    const finalAmount = useMemo(() => {
        return totalAmount + compoundTaxAmount;
    }, [totalAmount, compoundTaxAmount]);

    return {
        items: {
            selected: selectedItems,
            available: availableItems,
        },
        amounts: {
            gross: grossAmount,
            subTotal: subTotalAmount,
            total: totalAmount,
            final: finalAmount,
            discount: totalDiscount + itemsDiscount,
            tax: totalTaxAmount,
            itemsTax: itemTaxAmount,
            simpleTax: simpleTaxAmount,
            compoundTax: compoundTaxAmount,
        },
        taxes: {
            all: [ ...simpleTaxes, ...compoundTaxes, ...itemTaxes ],
            items: itemTaxes,
            simple: simpleTaxes,
            compound: compoundTaxes,
        }
    };
}
