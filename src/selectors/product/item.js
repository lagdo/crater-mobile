import React, { useMemo } from 'react';

const getTaxEntry = (tax, amount) => {
    return {
        ...tax,
        label: `${tax.name}  (${tax.percent} %)`,
        amount: (tax.percent * amount) / 100,
    };
};

export const useProductItem = (product) => {
    const {
        price = 0,
        quantity = 0,
        discount = 0,
        discount_type = 'none',
        taxes,
    } = product;

    // Product price and quantity
    const item = useMemo(() => {
        return { price, quantity };
    }, [price, quantity]);

    // Gross amount
    const grossAmount = useMemo(() => {
        return price * quantity;
    }, [price, quantity]);

    const discountAmount = useMemo(() => {
        if (discount_type === 'percentage') {
            return (discount * grossAmount) / 100;
        }
        if (discount_type === 'fixed') {
            return discount * 100;
        }
        return 0;
    }, [grossAmount, discount_type, discount]);

    // Simple taxes
    const simpleTaxes = useMemo(() => {
        const amount = grossAmount - discountAmount;
        return taxes.filter(tax => !tax.compound_tax).map(tax => getTaxEntry(tax, amount));
    }, [grossAmount, discountAmount, taxes]);

    // Simple tax amount
    const simpleTaxAmount = useMemo(() => {
        return simpleTaxes.reduce((total, tax) => total += tax.amount, 0);
    }, [simpleTaxes]);

    // Total amount
    const totalAmount = useMemo(() => {
        return grossAmount + simpleTaxAmount;
    }, [grossAmount, simpleTaxAmount]);

    // Compount taxes
    const compoundTaxes = useMemo(() => {
        return taxes.filter(tax => tax.compound_tax).map(tax => getTaxEntry(tax, totalAmount));
    }, [totalAmount, taxes]);

    // Compount tax amount
    const compoundTaxAmount = useMemo(() => {
        return compoundTaxes.reduce((total, tax) => total += tax.amount, 0);
    }, [compoundTaxes]);

    // Final amount
    const finalAmount = useMemo(() => {
        return totalAmount + compoundTaxAmount;
    }, [totalAmount, compoundTaxAmount]);

    return {
        item,
        amounts: {
            gross: grossAmount,
            total: totalAmount,
            final: finalAmount,
            tax: simpleTaxAmount + compoundTaxAmount,
            discount: discountAmount,
        },
        taxes: {
            all: [ ...simpleTaxes, ...compoundTaxes ],
            simple: simpleTaxes,
            compound: compoundTaxes,
        }
    };
}
