import React, { useState, useContext } from 'react';
import { Box, Chip, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import authenticationHandler from '../login/authentication-handler';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import NotificationView from './notification-view';
import ExpensesReceiptList from '../expenses-receipt/expenses-receipt-list/expenses-receipt-list';
import AddClaimView from '../claims/add-claim-view';
import ClaimListView from '../claims/claim-list-view';
import { claims, expenses } from '../main/routes';
import { UserContext } from '../user-provider/user-provider';
import { PathContext } from '../main/path-provider';

const NotificationGeneralView = () => {

    const { consortium } = useContext(ConsortiumContext);
    const { user } = useContext(UserContext);
    const [ updated, setUpdated ] = useState(false);
    const { setPath } = useContext(PathContext);

    return (
        <Box sx={{ minHeight: 'calc(100vh - 72px)', backgroundColor: 'background.default' }}>
            <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, md: 4 } }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5} sx={{ mb: 3 }}>
                    <Box>
                        <Typography variant="h4" sx={{ color: 'primary.dark', fontSize: { xs: 28, md: 34 } }}>Novedades</Typography>
                        <Typography variant="body2" color="text.secondary">Resumen de la actividad de tu consorcio</Typography>
                    </Box>
                    <Chip
                        label={consortium?.name || 'Selecciona un consorcio'}
                        color={consortium ? 'primary' : 'default'}
                        variant={consortium ? 'filled' : 'outlined'}
                        sx={{ maxWidth: '100%' }}
                    />
                </Stack>
                <Grid container spacing={2.5} alignItems="flex-start">
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 2, backgroundColor: '#FFFDF8' }}>
                            <Typography variant="overline" color="text.secondary">Estado financiero</Typography>
                            <Typography variant="h6" sx={{ mb: 1.5, color: 'primary.dark' }}>Mis expensas</Typography>
                            <ExpensesReceiptList action={() => setPath(expenses())} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ minHeight: 420, p: { xs: 2, md: 2.5 } }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Box>
                                    <Typography variant="overline" color="text.secondary">Comunicaciones</Typography>
                                    <Typography variant="h6" sx={{ color: 'primary.dark' }}>Actividad reciente</Typography>
                                </Box>
                                {consortium && <Chip label="Actualizado" size="small" color="secondary" />}
                            </Stack>
                            {consortium ?
                                <Box className="scrollbar-dinamically">
                                    <NotificationView setUpdated={setUpdated} />
                                </Box>
                                :
                                <Box sx={{ minHeight: 260, display: 'grid', placeItems: 'center', textAlign: 'center', color: 'text.secondary', px: 3 }}>
                                    <Typography variant="body2">Por favor selecciona un consorcio para ver sus novedades.</Typography>
                                </Box>
                            }
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 2, backgroundColor: '#FFFDF8' }}>
                            <Typography variant="overline" color="text.secondary">Seguimiento</Typography>
                            <Typography variant="h6" sx={{ mb: 1.5, color: 'primary.dark' }}>Reclamos pendientes</Typography>
                            {consortium ? <>
                                {!consortium.isAdministrator(user) && <Box sx={{ mb: 2 }}><AddClaimView /></Box>}
                                <ClaimListView
                                    sideEffect={() => setPath(claims())}
                                    filterFuction={(claim) => claim.state !== 'Close'}
                                />
                            </> : <Typography variant="body2" color="text.secondary">Selecciona un consorcio para consultar tus reclamos.</Typography>}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default authenticationHandler(NotificationGeneralView)
