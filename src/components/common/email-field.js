import React from 'react';
import { TextField } from '@mui/material';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = value => EMAIL_PATTERN.test(value.trim());

const EmailField = ({ allowEmpty, required, value = '', onChange, helperText, ...props }) => {
    const trimmedValue = value.trim();
    const invalid = trimmedValue.length > 0 && !isValidEmail(trimmedValue);

    return (
        <TextField
            {...props}
            value={value}
            onChange={onChange}
            type="email"
            error={invalid}
            helperText={invalid ? 'Ingresa un correo válido.' : helperText}
        />
    );
};

export { EMAIL_PATTERN, EmailField, isValidEmail };
