import React, { useContext } from 'react';
import { Box, Grid, Typography, Divider } from '@mui/material';
import ConsortiumsListView from '../../consortium/consortiums-list-view/consortiums-list-view';
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import ExpensesReceiptView from '../view/expenses-receipt-view';
import ExpensesReceiptList from '../expenses-receipt-list/expenses-receipt-list';
import { UserContext } from '../../user-provider/user-provider';
import authenticationHandler from '../../login/authentication-handler';
import { ExpensesReceiptContextProvider } from '../expenses-receipt-provider/expenses-receipt-provider';

const ExpensesReceiptGeneralView = props => {

    const { consortium, setConsortium } = useContext(ConsortiumContext);

    const { user } = useContext(UserContext);

    return (
        <Box sx={{
            p: { xs: 1, sm: 2, md: 3 },
            mx: { xs: 0, sm: 1, md: 2, lg: 4 }
        }}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={2}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: { xs: 'auto', md: '70vh' }
                    }}
                >
                    <ExpensesReceiptList add={true} />
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={10}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: { xs: 'auto', md: '70vh' }
                    }}
                >
                    {consortium ? (
                        <Box sx={{ overflowY: 'auto', height: '100%' }}>
                            <ExpensesReceiptView />
                        </Box>
                    ) : (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 300,
                            textAlign: 'center'
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                Expensas
                            </Typography>
                            <Divider sx={{ mb: 2, width: '100%' }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Por favor seleccione un consorcio
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    )
}

const ExpensesReceiptMainView = (props) => {
    return (
            <ExpensesReceiptContextProvider>
                <ExpensesReceiptGeneralView />
            </ExpensesReceiptContextProvider>
    )
}


export default authenticationHandler(ExpensesReceiptGeneralView)
