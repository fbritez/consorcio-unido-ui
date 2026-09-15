import React, { useContext } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardContent,
    CardHeader,
    Box,
    Grid,
    Typography,
    Chip,
    Stack,
    Divider,
    IconButton,
    Tooltip,
    Paper
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import { downloadTicket } from '../../utils/download-files';
import { CurrencyDisplay } from '../../common/currency-display';

const MemberDetailsView = (props) => {
    if (!props.item?.members || props.item.members.length === 0) {
        return (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                Sin asignación específica
            </Typography>
        );
    }

    return (
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {props.item.members.map((member) => (
                <Chip
                    key={member.member_name}
                    label={member.member_name}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 500 }}
                />
            ))}
        </Stack>
    );
};

const ExpenseDetails = (props) => {
    const expensesReceipt = props.expensesReceipt;

    if (!expensesReceipt) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No hay gastos registrados
                </Typography>
            </Box>
        );
    }

    const expenses = expensesReceipt.getExpenses?.() || [];

    if (expenses.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No hay gastos registrados
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Expenses List */}
            <Box sx={{ mb: 3 }}>
                {expenses.map((item, index) => (
                    <Accordion
                        key={index}
                        defaultExpanded={false}
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                            '&:before': { display: 'none' },
                            '&.Mui-expanded': {
                                borderRadius: 2
                            }
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                backgroundColor: '#f5f7fb',
                                '&.Mui-expanded': {
                                    backgroundColor: 'rgba(44, 64, 104, 0.04)'
                                },
                                py: 1.5
                            }}
                        >
                            <Grid container alignItems="center" spacing={2} sx={{ width: '100%' }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                        {item.title}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                    <CurrencyDisplay
                                        amount={item.amount}
                                        variant="body2"
                                        color="primary.main"
                                        sx={{ fontSize: '0.95rem' }}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionSummary>

                        <AccordionDetails sx={{ pt: 3, pb: 3 }}>
                            {item.description && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                                        Descripción
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.primary',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            lineHeight: 1.6
                                        }}
                                    >
                                        {item.description}
                                    </Typography>
                                </Box>
                            )}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                                    Unidades Funcionales
                                </Typography>
                                <MemberDetailsView item={item} />
                            </Box>

                            <Divider sx={{ my: 2 }} />
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5, display: 'block' }}>
                                            Monto
                                        </Typography>
                                        <CurrencyDisplay
                                            amount={item.amount}
                                            variant="body1"
                                            color="primary.main"
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                    <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                                        {props.userAdministrator && (
                                            <>
                                                <Tooltip title="Editar">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => props.updateAction?.(item)}
                                                        sx={{
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(44, 64, 104, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Eliminar">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => props.removeAction?.(item)}
                                                        sx={{
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(211, 47, 47, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}

                                        {item.ticket && (
                                            <Tooltip title="Descargar Comprobante">
                                                <IconButton
                                                    size="small"
                                                    color="success"
                                                    onClick={() => downloadTicket(item.ticket)}
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(76, 175, 80, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    <DownloadIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            {/* Total Card */}
            <Card
                sx={{
                    borderRadius: 2,
                    backgroundColor: 'transparent',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                    mt: 2
                }}
            >
                <CardContent sx={{ py: 2, px: 2 }}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Total a Pagar
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                            <CurrencyDisplay
                                amount={expensesReceipt.getTotalAmount()}
                                variant="body1"
                                color="text.primary"
                                sx={{ fontWeight: 700, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ExpenseDetails;
