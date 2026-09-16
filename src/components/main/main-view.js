import Login from '../login/login-view';
import PageNotFoundView from '../login/page-not-found';
import { UserContextProvider } from '../user-provider/user-provider';
import { UserContext } from '../user-provider/user-provider';
import ExpensesReceiptMainView from '../expenses-receipt/main-view/expenses-receipt-main-view';
import ConsortiumsMainView from '../consortium/consortiums-main-view/consortiums-main-view';
import { ConsortiumContextProvider } from '../consortium/consortium-provider/consortium-provider'
import NotificationMainView from '../notifications/notification-main-view';
import React, { useContext, useEffect } from "react";
import { Box } from '@mui/material';
import { useHistory } from "react-router-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import AppliactionNavView from '../application-nav/application-nav-view';
import ClaimMainView from '../claims/claim-main-view';
import { ClaimContextProvider } from '../claims/claim-provider';
import { ExpensesReceiptContextProvider } from '../expenses-receipt/expenses-receipt-provider/expenses-receipt-provider';
import { PathContext, PathContextProvider } from './path-provider';
import { onSessionExpired } from '../../services/utils/http-client';
import loginService from '../../services/login-service/login-service';
import userService from '../../services/user-service/user-service';
import { login, notifications } from './routes';


const UnitedConsortiumRoutes = () => {

    const history = useHistory();
    const { path, setPath } = useContext(PathContext)
    const { user, setUser } = useContext(UserContext)

    useEffect(async () => {
        history?.push(path)
    }, [path]);

    // Restore the session from the auth cookie so a reload does not force the
    // user to log in again.
    useEffect(() => {
        let active = true;

        loginService.getSession().then(async session => {
            if (!active || !session?.authenticated || !session.user_email) {
                return;
            }
            const loggedUser = await userService.getUser(session.user_email);
            if (active && loggedUser) {
                setUser(loggedUser);
                setPath(notifications());
            }
        });

        return () => {
            active = false;
        };
    }, []);

    // A token the backend no longer accepts sends the user back to the login.
    useEffect(() => {
        onSessionExpired(() => {
            setUser(undefined);
            setPath(login());
        });
    }, [setUser, setPath]);

    return (
        <React.Fragment>
            <AppliactionNavView />
            <Box component="main" sx={{ ml: user ? { sm: '248px' } : 0, pt: user ? { xs: 9, sm: 10 } : 0, minHeight: '100vh' }}>
                <Switch>
                    <Route path="/notifications">
                        <NotificationMainView />
                    </Route>
                    <Route path="/consortiums">
                        <ConsortiumsMainView />
                    </Route>
                    <Route path="/expenses">
                        <ExpensesReceiptMainView />
                    </Route>
                    <Route exact path="/claims">
                        <ClaimMainView />
                    </Route>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <Route >
                        <PageNotFoundView />
                    </Route>
                </Switch>
            </Box>
        </React.Fragment>
    )
}
const Main = () => {

    return (
        <ClaimContextProvider>
            <ExpensesReceiptContextProvider>
                <ConsortiumContextProvider>
                    <UserContextProvider>
                        <PathContextProvider>
                            <Router>
                                <UnitedConsortiumRoutes />
                            </Router>
                        </PathContextProvider>
                    </UserContextProvider>
                </ConsortiumContextProvider>
            </ExpensesReceiptContextProvider>
        </ClaimContextProvider>
    )
}

export default Main