import React, { useContext, useEffect } from 'react';
import { Box, Chip, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import authenticationHandler from '../login/authentication-handler';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import ClaimDetailsView from './claim-detail-view';
import AddClaimView from './add-claim-view';
import ClaimListView from './claim-list-view';
import { ClaimContext } from './claim-provider';
import { UserContext } from '../user-provider/user-provider';

const ClaimsGeneralView = () => {

    const { consortium } = useContext(ConsortiumContext);
    const { claim, setClaim } = useContext(ClaimContext)
    const { user } = useContext(UserContext)


    useEffect(async () => {
        setClaim(undefined);
    }, [consortium]);

    return (
        <Box sx={{ minHeight: 'calc(100vh - 72px)', backgroundColor: 'background.default' }}>
            <Container maxWidth="xl" sx={{ py: { xs: 1, md: 1.5 }, px: { xs: 2, md: 4 } }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5} sx={{ mb: 3 }}>
                    <Box>
                        <Typography variant="h4" sx={{ color: 'primary.dark', fontSize: { xs: 28, md: 34 } }}>Reclamos</Typography>
                        <Typography variant="body2" color="text.secondary">Seguimiento y comunicación sobre los problemas del consorcio.</Typography>
                    </Box>
                    <Chip label={consortium?.name || 'Selecciona un consorcio'} color={consortium ? 'primary' : 'default'} variant={consortium ? 'filled' : 'outlined'} sx={{ maxWidth: '100%' }} />
                </Stack>
                {consortium ? <Grid container spacing={2.5} alignItems="flex-start">
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 2, backgroundColor: '#FFFDF8' }}>
                            <Typography variant="overline" color="text.secondary">Bandeja</Typography>
                            <Typography variant="h6" color="primary.dark" sx={{ mb: 1.5 }}>Mis reclamos</Typography>
                            <ClaimListView />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ minHeight: 440, p: { xs: 2, md: 2.5 } }}>
                            {claim ? <Box className="scrollbar-dinamically"><ClaimDetailsView /></Box> : <Box sx={{ minHeight: 360, display: 'grid', placeItems: 'center', textAlign: 'center', px: 3 }}>
                                <Box>
                                    <Typography variant="h6" color="primary.dark" sx={{ mb: 1 }}>Selecciona un reclamo</Typography>
                                    <Typography variant="body2" color="text.secondary">Elige un reclamo de la bandeja para consultar su actividad.</Typography>
                                </Box>
                            </Box>}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        {!consortium.isAdministrator(user) && <Paper sx={{ p: 2, backgroundColor: '#FFFDF8' }}><AddClaimView /></Paper>}
                    </Grid>
                </Grid> : <Paper sx={{ minHeight: 360, display: 'grid', placeItems: 'center', textAlign: 'center', p: 3 }}>
                    <Box><Typography variant="h6" color="primary.dark" sx={{ mb: 1 }}>Selecciona un consorcio</Typography><Typography variant="body2" color="text.secondary">Necesitas seleccionar un consorcio para consultar sus reclamos.</Typography></Box>
                </Paper>}
            </Container>
        </Box>
    )
}

export default authenticationHandler(ClaimsGeneralView)
