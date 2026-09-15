import React, { useContext, useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Tabs,
    Tab,
    Button,
    Alert,
    Grid,
    Paper,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Stack,
    Divider
} from '@mui/material';
import { Add as AddIcon, CheckCircle as CheckCircleIcon, LockClock as LockClockIcon } from '@mui/icons-material';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import ExpenseItemView from '../expense-item/expense-item';
import ExpenseDetails from '../expense-details/expense-details';
import { ExpensesReceiptContext } from '../expenses-receipt-provider/expenses-receipt-provider';
import AddExpensesReceipt from './add-expenses-receipt';
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import { UserContext } from '../../user-provider/user-provider';
import PaymentStatusView from '../../payment-status/payment-status-view';
import MemberPaymentStatusView from '../../payment-status/member-payment-status-view';

const service = new ExpensesReceiptService();

function TabPanel(props) {
    const { children, value, index } = props;
    return (
        <div hidden={value !== index} role="tabpanel">
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

const ExpensesReceiptClosedStatus = ({ expensesReceipt, setShowExpensesCRUD, consortium, handleReceipt }) => {
    const [showCopyDialog, setShowCopyDialog] = useState(false);

    const handleClose = () => setShowCopyDialog(false);

    return (
        <>
            <Alert
                severity="success"
                icon={<CheckCircleIcon />}
                sx={{
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    color: '#2e7d32',
                    fontWeight: 600
                }}
            >
                ✓ Liquidación cerrada y generada correctamente
            </Alert>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setShowCopyDialog(true)}
                    sx={{ borderRadius: 2 }}
                >
                    Copiar de esta Liquidación
                </Button>
            </Box>

            <Dialog
                open={showCopyDialog}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2 } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>
                    Copiar Expensa de {expensesReceipt?.month} {expensesReceipt?.year}
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <AddExpensesReceipt
                        consortium={consortium}
                        setCurrentExpeses={(exp) => {
                            handleReceipt(exp);
                            handleClose();
                        }}
                        items={expensesReceipt.expense_items}
                        headers="  "
                        validate={false}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} variant="outlined">
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const ExpensesReceiptDetailHeader = () => {
    const { expensesReceipt } = useContext(ExpensesReceiptContext);
    const isOpen = expensesReceipt?.isOpen?.();

    return (
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardContent sx={{ pt: 3, pb: 3 }}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm="auto">
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            Gastos del Mes
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm="auto">
                        <Chip
                            label={`${expensesReceipt?.month} ${expensesReceipt?.year}`}
                            color={isOpen ? 'primary' : 'success'}
                            variant="filled"
                            icon={isOpen ? undefined : <CheckCircleIcon />}
                        />
                    </Grid>
                    <Grid item xs={12} sm="auto" sx={{ ml: 'auto' }}>
                        <Chip
                            label={isOpen ? 'Abierta' : 'Cerrada'}
                            color={isOpen ? 'warning' : 'success'}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                    Gestiona los gastos correspondientes al periodo seleccionado
                </Typography>
            </CardContent>
        </Card>
    );
};

const ExpensesReceiptDetailView = (props) => {
    const { expensesReceipt, setExpensesReceipt } = useContext(ExpensesReceiptContext);
    const { consortium } = useContext(ConsortiumContext);
    const [showExpensesCRUD, setShowExpensesCRUD] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [crudData, setCrudData] = useState({ selectedItem: null, selectedAction: null, selectedDescription: '' });
    const isAdministrator = props.isAdministrator;

    const update = (item) => {
        const expensesItem = service.createItemModel(item.newItem.item);
        const updatedExpense = expensesReceipt;
        const idx = updatedExpense.expense_items.findIndex((i) => i === item.oldItem);
        updatedExpense.expense_items[idx] = expensesItem;
        return { expense: updatedExpense, file: item.newItem.updatedFile };
    };

    const remove = (item) => {
        const expensesItem = service.createItemModel(item.newItem.item);
        const updatedExpense = expensesReceipt;
        updatedExpense.expense_items = updatedExpense.expense_items.filter((e) => e !== item.oldItem);
        return { expense: updatedExpense, file: item.newItem.updatedFile };
    };

    const add = (item) => {
        const expensesItem = service.createItemModel(item.newItem.item);
        const updatedExpense = expensesReceipt;
        updatedExpense.expense_items.push(expensesItem);
        return { expense: updatedExpense, file: item.newItem.updatedFile };
    };

    const setItemAction = (item, action, description) => {
        setCrudData({ selectedItem: item, selectedAction: action, selectedDescription: description });
        setShowExpensesCRUD(true);
    };

    const runAction = async (item, action) => {
        const { expense, file } = action(item);
        await service.save(expense, file);
        setExpensesReceipt(expense);
    };

    const closeExpenses = () => {
        expensesReceipt.close();
        service.generateReceipt(expensesReceipt).then(
            () => {
                setExpensesReceipt(undefined);
            },
            () => { }
        );
    };

    const handleReceipt = (expensesReceipt) => {
        setExpensesReceipt(expensesReceipt);
        setShowExpensesCRUD(false);
    };

    return (
        <Box>
            <ExpensesReceiptDetailHeader />

            {isAdministrator && (
                <>
                    {!expensesReceipt?.isOpen?.() ? (
                        <ExpensesReceiptClosedStatus
                            expensesReceipt={expensesReceipt}
                            setShowExpensesCRUD={setShowExpensesCRUD}
                            consortium={consortium}
                            handleReceipt={handleReceipt}
                        />
                    ) : (
                        <Card sx={{ mb: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => setItemAction(null, add, 'Agregar')}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Agregar Gasto
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => closeExpenses()}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Generar Liquidación
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}

            {showExpensesCRUD && (
                <ExpenseItemView
                    item={crudData.selectedItem}
                    handleAction={(item) => runAction(item, crudData.selectedAction)}
                    actionDescription={crudData.selectedDescription}
                    show={showExpensesCRUD}
                    showExpensesCRUD={(bool) => setShowExpensesCRUD(bool)}
                />
            )}

            <Card sx={{ borderRadius: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tabValue}
                        onChange={(_, newValue) => setTabValue(newValue)}
                        sx={{
                            '& .MuiTab-root': { fontWeight: 500, textTransform: 'none' },
                            '& .Mui-selected': { color: 'primary.main' }
                        }}
                    >
                        <Tab label="Gastos" />
                        {!expensesReceipt?.isOpen?.() && <Tab label="Seguimiento de Pagos" />}
                    </Tabs>
                </Box>

                <CardContent sx={{ pt: 3 }}>
                    <TabPanel value={tabValue} index={0}>
                        <ExpenseDetails
                            expensesReceipt={expensesReceipt}
                            userAdministrator={isAdministrator}
                            updateAction={(item) => setItemAction(item, update, 'Modificar')}
                            removeAction={(item) => setItemAction(item, remove, 'Eliminar')}
                        />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                Seguimiento de Pagos
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Consulta el estado de cada unidad y registra los pagos recibidos.
                            </Typography>
                        </Box>
                        <PaymentStatusView expensesReceipt={expensesReceipt} />
                    </TabPanel>
                </CardContent>
            </Card>
        </Box>
    );
};

const MemberDetailHeader = () => {
    const { user } = useContext(UserContext);
    const { consortium } = useContext(ConsortiumContext);
    const member = consortium?.getMember?.(user);

    return (
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            Unidad Funcional
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
                            {member?.member_name || 'N/A'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            Consorcio
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
                            {consortium?.name || 'N/A'}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

const MemberExpensesReceiptDetailView = () => {
    const { user } = useContext(UserContext);
    const { expensesReceipt } = useContext(ExpensesReceiptContext);
    const [particularExpenses, setParticularExpenses] = useState();
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        if (expensesReceipt) {
            const expenses = expensesReceipt.getMemberReceiptFor?.(user);
            setParticularExpenses(expenses);
        }
    }, [expensesReceipt, user]);

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <ExpensesReceiptDetailHeader />
            <MemberDetailHeader />

            <Card sx={{ borderRadius: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tabValue}
                        onChange={(_, newValue) => setTabValue(newValue)}
                        sx={{
                            '& .MuiTab-root': { fontWeight: 500, textTransform: 'none' },
                            '& .Mui-selected': { color: 'primary.main' }
                        }}
                    >
                        <Tab label="Mi Resumen" />
                        <Tab label="Gastos Generales" />
                        <Tab label="Seguimiento" />
                    </Tabs>
                </Box>

                <CardContent sx={{ pt: 3 }}>
                    <TabPanel value={tabValue} index={0}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                Gastos particulares asignados a tu unidad
                            </Typography>
                        </Box>
                        <ExpenseDetails expensesReceipt={particularExpenses} userAdministrator={false} />
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                Gastos generales del consorcio
                            </Typography>
                        </Box>
                        <ExpenseDetails expensesReceipt={expensesReceipt} userAdministrator={false} />
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                Seguimiento de Pagos
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Detalle de pagos por unidad funcional.
                            </Typography>
                        </Box>
                        <MemberPaymentStatusView expensesReceipt={expensesReceipt} />
                    </TabPanel>
                </CardContent>
            </Card>
        </Box>
    );
};

export { ExpensesReceiptDetailView, MemberExpensesReceiptDetailView };
