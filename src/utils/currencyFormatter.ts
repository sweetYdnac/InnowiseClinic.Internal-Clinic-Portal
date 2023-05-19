const formatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export const ToCurrency = (value: number) => formatter.format(value);
