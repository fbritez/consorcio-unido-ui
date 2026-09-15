import React from 'react';
import { Typography, Box } from '@mui/material';

const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '$0,00';
    }

    const numAmount = parseFloat(amount);
    const formatted = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numAmount);

    return formatted;
};

const CurrencyDisplay = ({
    amount,
    variant = 'body1',
    color = 'text.primary',
    fontWeight = 600,
    component = Typography,
    sx = {},
    ...props
}) => {
    const formattedAmount = formatCurrency(amount);

    return (
        <Typography
            variant={variant}
            sx={{
                fontWeight,
                color,
                ...sx
            }}
            component={component}
            {...props}
        >
            {formattedAmount}
        </Typography>
    );
};

export { CurrencyDisplay, formatCurrency };
