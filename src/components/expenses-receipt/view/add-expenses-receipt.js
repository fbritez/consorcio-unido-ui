import React, { useState, useContext } from 'react';
import {
    Box,
    Button,
    Grid,
    MenuItem,
    Select,
    FormControl,
    Typography,
    Stack,
    Alert,
    Divider,
    Card,
    CardContent
} from '@mui/material';
import ExpensesReceiptList from '../expenses-receipt-list/expenses-receipt-list';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import ErrorHandler from '../../common/handlers/error-handler';
import { ExpensesReceiptContext } from '../expenses-receipt-provider/expenses-receipt-provider';

const service = new ExpensesReceiptService();

const months = ['Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septimbre',
    'Octubre',
    'Noviembre',
    'Diciembre'
]

const range = (start, end) => {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}


const AddExpensesReceipt = props => {
    const { triggerRefresh } = useContext(ExpensesReceiptContext);

    const defaultMonthDescription = 'Elegir mes';
    const defaultYearDescription = 'Elegir Año';

    const [monthDescription, setMonthDescription] = useState(defaultMonthDescription);
    const [yearDescription, setYearDescription] = useState(defaultYearDescription);
    const [wrongTransacion, setWrongTransaction] = useState(false);
    const [invalidMonth, setInvalidMonth] = useState(false);
    const [invalidYear, setInvalidYear] = useState(false);

    const validateData = () => {
        const m = monthDescription == defaultMonthDescription
        const y = yearDescription == defaultYearDescription
        setInvalidMonth(m)
        setInvalidYear(y);
        return (!m && !y)
    }

    const generateExpensesRecepit = async () => {
        if (validateData()) {
            const items = props.items ? props.items : [];
            await service.createExpenseReceipt(props.consortium, monthDescription, yearDescription, items)
                .then(
                    (exp) => {
                        props.setCurrentExpeses(exp);
                        triggerRefresh();
                    },
                    () => setWrongTransaction(true))
        }

    }

    const errorDescriptions = [{
        value: wrongTransacion,
        description: 'La Liquidación no pudo ser generada. Por favor contactese con el administrador'
    }, {
        value: invalidMonth,
        description: 'El mes seleccionado no es valido'
    }, {
        value: invalidYear,
        description: 'El año seleccionado no es valido'
    }]

    return (
        <Box sx={{ maxWidth: 500, mx: { xs: 'auto', sm: 0 } }}>
            {props.headers ? props.headers :
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                        Iniciar Expensas
                    </Typography>
                    <Divider />
                </Box>
            }
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6 }}>
                Seleccione mes y año para la nueva liquidación de expensas.
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                            <Select
                                value={monthDescription}
                                onChange={(e) => setMonthDescription(e.target.value)}
                                displayEmpty
                                sx={{ borderRadius: 1 }}
                            >
                                <MenuItem value={defaultMonthDescription} disabled>
                                    {defaultMonthDescription}
                                </MenuItem>
                                {months.map((month) => (
                                    <MenuItem key={month} value={month}>
                                        {month}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                            <Select
                                value={yearDescription}
                                onChange={(e) => setYearDescription(e.target.value)}
                                displayEmpty
                                sx={{ borderRadius: 1 }}
                            >
                                <MenuItem value={defaultYearDescription} disabled>
                                    {defaultYearDescription}
                                </MenuItem>
                                {range(2021, 2030).map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Alert
                    severity="info"
                    sx={{
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        color: 'info.main',
                        fontSize: '0.875rem',
                        borderRadius: 1
                    }}
                >
                    Una vez creada la liquidación de expensas no podrá eliminarla.
                </Alert>
            </Box>

            <ErrorHandler errors={errorDescriptions} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button
                    variant="contained"
                    onClick={generateExpensesRecepit}
                    disabled={invalidYear || invalidMonth}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                    Generar
                </Button>
            </Box>
        </Box>
    )
}

export default AddExpensesReceipt