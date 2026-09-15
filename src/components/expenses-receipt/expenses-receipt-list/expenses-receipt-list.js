import React, { useEffect, useState, useContext } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Card,
    CardHeader,
    CardContent,
    Chip,
    Button,
    Divider,
    Typography,
    Stack,
    CircularProgress,
    Paper
} from '@mui/material';
import { Add as AddIcon, Description as DescriptionIcon } from '@mui/icons-material';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import { UserContext } from '../../user-provider/user-provider';
import { ExpensesReceiptContext } from '../expenses-receipt-provider/expenses-receipt-provider';

const service = new ExpensesReceiptService();

const ExpensesReceiptList = (props) => {
    const { user } = useContext(UserContext);
    const [expenses, setExpenses] = useState(null);
    const [loading, setLoading] = useState(true);
    const { expensesReceipt, setExpensesReceipt } = useContext(ExpensesReceiptContext);
    const { consortium } = useContext(ConsortiumContext);
    const [isAdministrator, setIsAdministrator] = useState(false);

    useEffect(() => {
        const loadExpenses = async () => {
            if (consortium) {
                setLoading(true);
                try {
                    const exp = await service.getExpensesAccordingUser(consortium, user);
                    setExpenses(exp);
                    setIsAdministrator(consortium.isAdministrator(user));
                } catch (error) {
                    console.error('Error loading expenses:', error);
                    setExpenses([]);
                }
                setLoading(false);
            }
        };
        loadExpenses();
    }, [consortium, user]);

    const getStatusChip = (item) => {
        if (item.isOpen?.()) {
            return (
                <Chip
                    label="Abierta"
                    color="warning"
                    size="small"
                    variant="filled"
                    sx={{ fontWeight: 600 }}
                />
            );
        }
        return (
            <Chip
                label="Cerrada"
                color="success"
                size="small"
                variant="filled"
                sx={{ fontWeight: 600 }}
            />
        );
    };

    const handleSelectExpense = (item) => {
        setExpensesReceipt(item);
        if (props.action) {
            props.action(item);
        }
    };

    const handleNewExpense = () => {
        setExpensesReceipt(undefined);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header Card */}
            <Card
                sx={{
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    backgroundColor: 'background.paper'
                }}
            >
                <CardHeader
                    title="Liquidaciones"
                    titleTypographyProps={{ variant: 'h6', sx: { fontWeight: 700 } }}
                    subheader="Gestiona tus expensas"
                    subheaderTypographyProps={{ variant: 'body2', sx: { color: 'text.secondary' } }}
                    sx={{ pb: 1 }}
                />
            </Card>

            {/* New Expense Button - Admin Only */}
            {isAdministrator && props.add && (
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleNewExpense}
                    fullWidth
                    sx={{
                        mb: 2,
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.95rem'
                    }}
                >
                    Nueva Liquidación
                </Button>
            )}

            {/* Expenses List */}
            <Paper
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    borderRadius: 2,
                    bgcolor: 'background.paper'
                }}
            >
                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 200
                        }}
                    >
                        <CircularProgress size={40} />
                    </Box>
                ) : expenses && expenses.length > 0 ? (
                    <List sx={{ p: 0 }}>
                        {expenses.map((item, index) => (
                            <React.Fragment key={`${item.year}-${item.month}`}>
                                <ListItem
                                    disablePadding
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'action.hover'
                                        },
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <ListItemButton
                                        onClick={() => handleSelectExpense(item)}
                                        selected={
                                            expensesReceipt?.year === item.year &&
                                            expensesReceipt?.month === item.month
                                        }
                                        sx={{
                                            py: 2,
                                            px: 2,
                                            '&.Mui-selected': {
                                                backgroundColor: 'rgba(44, 64, 104, 0.08)',
                                                borderLeft: '4px solid',
                                                borderColor: 'primary.main',
                                                pl: 1.5
                                            }
                                        }}
                                    >
                                        <DescriptionIcon
                                            sx={{
                                                mr: 2,
                                                color: 'primary.main',
                                                fontSize: '1.5rem'
                                            }}
                                        />
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="body1"
                                                    sx={{ fontWeight: 600, color: 'text.primary' }}
                                                >
                                                    {item.month} {item.year}
                                                </Typography>
                                            }
                                            secondary={
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {getStatusChip(item)}
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ color: 'text.secondary', alignSelf: 'center' }}
                                                    >
                                                        {item.expense_items?.length || 0} gastos
                                                    </Typography>
                                                </Stack>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                                {index < expenses.length - 1 && <Divider sx={{ my: 0 }} />}
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 200,
                            color: 'text.secondary'
                        }}
                    >
                        <DescriptionIcon sx={{ fontSize: '2.5rem', mb: 1, opacity: 0.5 }} />
                        <Typography variant="body2">No hay liquidaciones disponibles</Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default ExpensesReceiptList;
