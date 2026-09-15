import React, { useContext, useState, useEffect } from 'react';
import { Button as MuiButton } from '../common/mui-components';
import { TextField, Box, Grid, Typography, Paper, Chip, Stack, Divider, IconButton, Tooltip } from '@mui/material';
import { GetApp as DownloadIcon, Clear as ClearIcon } from '@mui/icons-material';
import { ExpensesReceiptContext } from '../expenses-receipt/expenses-receipt-provider/expenses-receipt-provider';
import ExpensesReceiptService from '../../services/expense-receipt-service/expense-receipt-service';
import { getStatus } from './utils';
import { FileUploaderButton } from '../common/buttons';
import { downloadTicket } from '../utils/download-files';
import { image } from 'react-dom-factories';
import imageService from '../../services/image-service/image-service';
import { CurrencyDisplay } from '../common/currency-display';

const expensesReceiptService = new ExpensesReceiptService();

const PaymentButton = props => {
    return (
        <MuiButton
            disabled={props.disabled}
            onClick={props.action}
            variant="contained"
            size="small"
            sx={{ textTransform: 'none', fontSize: '0.8rem' }}
        >
            {props.description}
        </MuiButton>
    )
}

const PaymentMemberView = props => {

    const [amount, setAmount] = useState();
    const [rerender, setRerender] = useState(false);
    const { expensesReceipt, setExpensesReceipt } = useContext(ExpensesReceiptContext);

    useEffect(async () => {
        setAmount(props.memberReceipt?.paid_amount)
    }, [expensesReceipt]);

    const save = (memberReceipt, file) => {
        expensesReceipt.updateMemberReceipt(memberReceipt);
        expensesReceiptService.save(expensesReceipt, file).then(() => {
            setExpensesReceipt(expensesReceipt)
        }, () => { })
    }

    const handleChange = amount => {
        setAmount(amount)
        props.setAmountChange(amount)
        props.memberReceipt.setPaidAmount(amount);
        save(props.memberReceipt)
    }

    const onFileChange = async (file) => {
        setRerender(!rerender)
        props.memberReceipt.setTicket(file.name);
        save(props.memberReceipt, file)
    }

    const cleanFile = () => {
        setRerender(!rerender)
        props.memberReceipt.setTicket(undefined);
        save(props.memberReceipt)
    }

    useEffect(async () => {
        setAmount(props.memberReceipt.paid_amount)
    }, [props.amountChange]);

    const memberPaymentButton = (description, value) => {
        return <PaymentButton description={description} action={() => handleChange(value)} disabled={false} />
    }


    return (
        <Paper
            sx={{
                p: 2,
                mb: 1,
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)'
                },
                transition: 'box-shadow 0.2s'
            }}
        >
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={1.5}>
                    <Chip
                        label={props.memberReceipt?.member.member_name}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={1.5}>
                    {getStatus(props.memberReceipt)}
                </Grid>
                <Grid item xs={12} sm={4} md={1.5}>
                    <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                            A pagar
                        </Typography>
                        <CurrencyDisplay amount={props.memberReceipt?.getTotalAmount?.()} variant="body2" sx={{ fontWeight: 600 }} />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4} md={1.5}>
                    <TextField
                        type="number"
                        disabled={false}
                        onBlur={(event) => handleChange(parseFloat(event.target.value))}
                        value={amount || ''}
                        onChange={event => setAmount(event.target.value)}
                        size="small"
                        variant="outlined"
                        label="Pagado"
                        sx={{ width: '100%' }}
                        inputProps={{
                            step: "0.01",
                            min: "0"
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4} md={1.5}>
                    <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                            Pendiente
                        </Typography>
                        <CurrencyDisplay amount={props.memberReceipt?.difference?.()} variant="body2" sx={{ fontWeight: 600 }} />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={1.5}>
                    <Stack direction="row" spacing={0.5}>
                        <FileUploaderButton disabled={false} handleFile={onFileChange} />
                        {props.memberReceipt.filename && (
                            <>
                                <Tooltip title="Descargar">
                                    <IconButton
                                        size="small"
                                        onClick={() => downloadTicket(props.memberReceipt.ticket)}
                                        sx={{ color: 'primary.main' }}
                                    >
                                        <DownloadIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Eliminar">
                                    <IconButton
                                        size="small"
                                        onClick={cleanFile}
                                        sx={{ color: 'error.main' }}
                                    >
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                        {props.memberReceipt?.difference() === 0 ?
                            memberPaymentButton('Cancelar', 0) :
                            memberPaymentButton('Pagar', props.memberReceipt?.getTotalAmount())}
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    )
}


const PaymentStatusView = () => {

    const { expensesReceipt, setExpensesReceipt } = useContext(ExpensesReceiptContext);
    const [amountChange, setAmountChange] = useState(true)

    const update = receipt => {
        expensesReceiptService.save(receipt).then(() => {
            setAmountChange(!amountChange)
            setExpensesReceipt(receipt)
        }, () => { })
    }
    const payAll = () => {
        expensesReceipt.payAll();
        update(expensesReceipt);
    }

    const cancelAllPayments = () => {
        expensesReceipt.cancelAllPayments();
        update(expensesReceipt);
    }

    return (
        <Box sx={{ p: 0 }}>
            {/* Header Row */}
            <Paper
                sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: 'rgba(44, 64, 104, 0.04)',
                    borderRadius: 2,
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={1.5}>
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', fontSize: '0.7rem' }}>
                            Unidad
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={1.5}>
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', fontSize: '0.7rem' }}>
                            Estado
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} md={1.5}>
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', fontSize: '0.7rem' }}>
                            A pagar
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} md={1.5}>
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', fontSize: '0.7rem' }}>
                            Pagado
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} md={1.5}>
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', fontSize: '0.7rem' }}>
                            Pendiente
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={1.5}>
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', fontSize: '0.7rem' }}>
                            Archivos
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={1.5}>
                        <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                            {expensesReceipt?.totalDifference() === 0 ?
                                <PaymentButton description={'Cancelar Todos'} action={cancelAllPayments} disabled={false} /> :
                                <PaymentButton description={'Pagar Todos'} action={payAll} disabled={false} />
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Members List */}
            <Box sx={{ mb: 3 }}>
                {expensesReceipt.member_expenses_receipt_details.map(memberReceipt => {
                    return <PaymentMemberView
                        key={memberReceipt.member.member_name}
                        amountChange={amountChange}
                        setAmountChange={setAmountChange}
                        memberReceipt={memberReceipt}
                    />
                })}
            </Box>

            {/* Totals Row */}
            <Paper
                sx={{
                    p: 2,
                    backgroundColor: 'rgba(76, 175, 80, 0.05)',
                    borderRadius: 2,
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'success.main'
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={1.5}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            Totales
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={1.5} />
                    <Grid item xs={12} sm={4} md={1.5}>
                        <Box>
                            <CurrencyDisplay
                                amount={expensesReceipt.getTotalAmount?.()}
                                variant="body2"
                                sx={{ fontWeight: 700, color: 'text.primary' }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4} md={1.5} />
                    <Grid item xs={12} sm={4} md={1.5}>
                        <Box>
                            <CurrencyDisplay
                                amount={expensesReceipt.totalDifference?.()}
                                variant="body2"
                                sx={{ fontWeight: 700, color: 'success.main' }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} />
                </Grid>
            </Paper>
        </Box>
    )
}

export default PaymentStatusView