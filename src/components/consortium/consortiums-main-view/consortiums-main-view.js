import React, { useState, useContext } from 'react';
import { Box, Chip, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import ConsortiumsListView from '../consortiums-list-view/consortiums-list-view';
import { UserContext } from '../../user-provider/user-provider';
import { ConsortiumContext, ConsortiumContextProvider } from '../consortium-provider/consortium-provider';
import authenticationHandler from '../../login/authentication-handler';
import ConsortiumDetails from '../consortium-details-view/consortium-details-view';

const ConsortiumsGeneralView = (props) => {

    const { consortium, setConsortium } = useContext(ConsortiumContext);
    const [updated, setUpdated] = useState(false);
    const { user, setUser } = useContext(UserContext);


    const setConsortiums = (c) => {
        setConsortium(undefined)
        setConsortium(c)
    }

    return (
        <Box sx={{ minHeight: 'calc(100vh - 72px)', backgroundColor: 'background.default' }}>
            <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, md: 4 } }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mb: 3 }}>
                    <Box>
                        <Typography variant="h4" sx={{ color: 'primary.dark', fontSize: { xs: 28, md: 34 } }}>Administrar consorcios</Typography>
                        <Typography variant="body2" color="text.secondary">Gestiona los datos, unidades funcionales y configuración de cada consorcio.</Typography>
                    </Box>
                    <Chip label={`${user?.email || ''}`} variant="outlined" color="primary" sx={{ maxWidth: '100%' }} />
                </Stack>
                <Grid container spacing={2.5} alignItems="flex-start">
                    <Grid item xs={12} lg={3}>
                        <Paper sx={{ p: { xs: 2, md: 2.5 }, backgroundColor: '#FFFDF8' }}>
                            <ConsortiumsListView setConsortium={setConsortiums} user={user} add={true} updated={updated} dense />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} lg={9}>
                        <Paper sx={{ p: { xs: 2, md: 3 }, minHeight: 420 }}>
                            {consortium ?
                                <Box className="scrollbar-dinamically">
                                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mb: 2 }}>
                                        <Box>
                                            <Typography variant="overline" color="text.secondary">Configuración seleccionada</Typography>
                                            <Typography variant="h6" color="primary.dark">{consortium.name || 'Nuevo consorcio'}</Typography>
                                        </Box>
                                    </Stack>
                                    <ConsortiumDetails setUpdated={setUpdated} updated={updated} />
                                </Box>
                                :
                                <Box sx={{ minHeight: 360, display: 'grid', placeItems: 'center', textAlign: 'center', px: 3 }}>
                                    <Box>
                                        <Typography variant="h6" color="primary.dark" sx={{ mb: 1 }}>Selecciona un consorcio</Typography>
                                        <Typography variant="body2" color="text.secondary">Elige una tarjeta de la izquierda para ver y editar su información.</Typography>
                                    </Box>
                                </Box>
                            }
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

const ConsortiumsMainView = (props) => {
    return (
        <ConsortiumContextProvider>
            <ConsortiumsGeneralView />
        </ConsortiumContextProvider>
    )
}

export default authenticationHandler(ConsortiumsGeneralView)
