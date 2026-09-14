import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#2C4068', light: '#5278C5', dark: '#1B2945' },
        secondary: { main: '#C9784A', contrastText: '#FFFFFF' },
        background: { default: '#F5F7FB', paper: '#FFFFFF' },
    },
    shape: { borderRadius: 8 },
    typography: {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        fontSize: 14,
        h4: { fontSize: '1.9rem', fontWeight: 700, letterSpacing: 0 },
        h5: { fontSize: '1.4rem', fontWeight: 700, letterSpacing: 0 },
        h6: { fontSize: '1.1rem', fontWeight: 700, letterSpacing: 0 },
        body1: { fontSize: '0.9rem' },
        body2: { fontSize: '0.82rem' },
        button: { fontSize: '0.82rem', fontWeight: 700, letterSpacing: 0 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: { backgroundColor: '#F5F7FB' },
                '#root': { minHeight: '100vh' },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    paddingInline: 14,
                    minHeight: 38,
                    '&.MuiButton-containedPrimary:hover': { backgroundColor: '#1B2945' },
                    '&.MuiButton-outlinedPrimary:hover': { backgroundColor: 'rgba(44, 64, 104, 0.08)' },
                    '&.Mui-focusVisible': { outline: '3px solid rgba(82, 120, 197, 0.35)', outlineOffset: 2 },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: { border: '1px solid rgba(44, 64, 104, 0.12)', borderRadius: 12, boxShadow: '0 8px 24px rgba(44, 64, 104, 0.08)' },
            },
        },
        MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
        MuiChip: { styleOverrides: { root: { fontWeight: 700 } } },
    },
});

export default theme;
