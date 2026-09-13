import React, { useState, useContext, useEffect } from 'react';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { HomeOutlined, Logout, ManageAccountsOutlined, ReceiptLongOutlined, ReportProblemOutlined } from '@mui/icons-material';
import logo from '../../images/medium-icon.png';
import { BsPeopleCircle } from 'react-icons/bs';
import { UserContext } from '../user-provider/user-provider';
import consortiumService from '../../services/consortium-service/consortium-service';
import ConsortiumDropdown from '../consortium/consortium-dropdown';
import { consortiums, notifications, claims, expenses, login } from '../main/routes';
import { PathContext } from '../main/path-provider';

const service = consortiumService;

const AppliactionNavView = () => {

    const { user, setUser } = useContext(UserContext);
    const [isAdministrator, setIsAdministrator] = useState();
    const { path, setPath } = useContext(PathContext) || {};
    const [userMenuAnchor, setUserMenuAnchor] = useState(null);

    useEffect(() => {
        let active = true;

        if (user) {
            service.isAdministrator(user).then(result => {
                if (active) {
                    setIsAdministrator(result);
                }
            });
        } else {
            setIsAdministrator(false);
        }

        return () => {
            active = false;
        };
    }, [user]);

    const logout = () => {
        setUserMenuAnchor(null)
        setUser(undefined)
        setPath(login())
    }

    const handleClick = route => {
        setPath?.(route);
    }

    const navItems = [
        { id: 'notification', label: 'Novedades', route: notifications(), icon: <HomeOutlined /> },
        { id: 'expenses', label: 'Expensas', route: expenses(), icon: <ReceiptLongOutlined /> },
        { id: 'claims', label: 'Reclamos', route: claims(), icon: <ReportProblemOutlined /> },
    ];

    return (
        <div>
            {user && <>
                <AppBar position="static" elevation={0} sx={{ backgroundColor: '#E3DECA', color: 'primary.main', borderBottom: '1px solid', borderColor: 'rgba(44, 64, 104, 0.12)' }}>
                    <Toolbar>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexGrow: 1, minWidth: 0 }}>
                            <Tooltip title="Ir a novedades">
                                <Box component="img" src={logo} alt="Consorcio Unido" width={46} height={46} sx={{ cursor: 'pointer', objectFit: 'contain', flexShrink: 0 }} onClick={() => handleClick(notifications())} />
                            </Tooltip>
                            <ConsortiumDropdown />
                            {isAdministrator && <Button data-testid='consortiums' startIcon={<ManageAccountsOutlined />} onClick={() => handleClick(consortiums())} sx={{ color: 'primary.main', display: { xs: 'none', sm: 'inline-flex' } }}>Administrar</Button>}
                        </Box>
                        <Typography noWrap sx={{ display: { xs: 'none', md: 'block' }, maxWidth: 220, color: 'text.secondary', fontSize: 14 }}>{user.email}</Typography>
                        <Tooltip title="Menú de usuario">
                            <IconButton aria-label="Menú de usuario" onClick={event => setUserMenuAnchor(event.currentTarget)} sx={{ color: 'primary.main' }}><BsPeopleCircle /></IconButton>
                        </Tooltip>
                        <Menu anchorEl={userMenuAnchor} open={Boolean(userMenuAnchor)} onClose={() => setUserMenuAnchor(null)}>
                            <MenuItem onClick={logout}><Logout fontSize="small" sx={{ mr: 1 }} />Cerrar sesión</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Box component="nav" aria-label="Navegación principal" sx={{ backgroundColor: '#EEE9D5', borderBottom: '1px solid', borderColor: 'rgba(44, 64, 104, 0.12)' }}>
                    <Toolbar >
                        {navItems.map(item => <Button
                            key={item.id}
                            data-testid={item.id}
                            startIcon={item.icon}
                            onClick={() => handleClick(item.route)}
                            aria-current={path === item.route ? 'page' : undefined}
                            sx={{
                                minHeight: 38,
                                color: path === item.route ? 'primary.main' : 'text.secondary',
                                borderBottom: 2,
                                borderColor: path === item.route ? 'secondary.main' : 'transparent',
                                borderRadius: 0,
                                px: { xs: 1, sm: 2 },
                                '&:hover': { color: 'primary.main', backgroundColor: 'rgba(44, 64, 104, 0.05)' },
                            }}
                        >{item.label}</Button>)}
                        {isAdministrator && <IconButton aria-label="Administrar consorcios" onClick={() => handleClick(consortiums())} sx={{ display: { xs: 'inline-flex', sm: 'none' }, color: 'primary.main', ml: 'auto' }}><ManageAccountsOutlined /></IconButton>}
                    </Toolbar>
                </Box>
            </>}
        </div>
    )


}

export default AppliactionNavView