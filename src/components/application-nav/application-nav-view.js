import React, { useState, useContext, useEffect } from 'react';
import { AppBar, Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { HomeOutlined, Logout, ManageAccountsOutlined, Menu as MenuIcon, ReceiptLongOutlined, ReportProblemOutlined } from '@mui/icons-material';
import logo from '../../images/medium-icon.png';
import { BsPeopleCircle } from 'react-icons/bs';
import { UserContext } from '../user-provider/user-provider';
import consortiumService from '../../services/consortium-service/consortium-service';
import ConsortiumDropdown from '../consortium/consortium-dropdown';
import { consortiums, notifications, claims, expenses, login } from '../main/routes';
import { PathContext } from '../main/path-provider';

const service = consortiumService;
const drawerWidth = 248;

const AppliactionNavView = () => {

    const { user, setUser } = useContext(UserContext);
    const [isAdministrator, setIsAdministrator] = useState();
    const { path, setPath } = useContext(PathContext) || {};
    const [userMenuAnchor, setUserMenuAnchor] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

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
        setMobileOpen(false);
    }

    const navItems = [
        { id: 'notification', label: 'Novedades', route: notifications(), icon: <HomeOutlined /> },
        { id: 'expenses', label: 'Expensas', route: expenses(), icon: <ReceiptLongOutlined /> },
        { id: 'claims', label: 'Reclamos', route: claims(), icon: <ReportProblemOutlined /> },
    ];

    const drawerContent = (
        <Box sx={{ height: '100%', backgroundColor: '#E3DECA' }}>
            <Toolbar sx={{ minHeight: 72, px: 2, gap: 1.5 }}>
                <Box component="img" src={logo} alt="Consorcio Unido" width={42} height={42} sx={{ objectFit: 'contain' }} />
                <Typography variant="subtitle1" sx={{ color: 'primary.dark', fontWeight: 800, lineHeight: 1.1 }}>Consorcio<br />Unido</Typography>
            </Toolbar>
            <Divider sx={{ borderColor: 'rgba(44, 64, 104, 0.14)' }} />
            <Box sx={{ px: 1.5, py: 2 }}>
                <Typography variant="overline" sx={{ px: 1.5, color: 'text.secondary', fontWeight: 700 }}>Panel principal</Typography>
                <List disablePadding sx={{ mt: 0.5 }}>
                    {navItems.map(item => <ListItemButton
                        key={item.id}
                        data-testid={item.id}
                        selected={path === item.route}
                        onClick={() => handleClick(item.route)}
                        sx={{
                            borderRadius: 1.5,
                            mb: 0.5,
                            color: 'primary.main',
                            '&.Mui-selected': { backgroundColor: 'primary.main', color: 'common.white', '&:hover': { backgroundColor: 'primary.dark' } },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>)}
                    {isAdministrator && <ListItemButton data-testid="consortiums" selected={path === consortiums()} onClick={() => handleClick(consortiums())} sx={{ borderRadius: 1.5, color: 'primary.main', '&.Mui-selected': { backgroundColor: 'primary.main', color: 'common.white' } }}>
                        <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}><ManageAccountsOutlined /></ListItemIcon>
                        <ListItemText primary="Administrar" />
                    </ListItemButton>}
                </List>
            </Box>
        </Box>
    );

    return user ? <>
        <AppBar position="fixed" elevation={0} sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }, backgroundColor: '#EEE9D5', color: 'primary.main', borderBottom: '1px solid', borderColor: 'rgba(44, 64, 104, 0.14)' }}>
            <Toolbar sx={{ minHeight: 72, gap: 2, px: { xs: 2, sm: 3 } }}>
                <IconButton aria-label="Abrir menú" onClick={() => setMobileOpen(true)} sx={{ display: { sm: 'none' }, color: 'primary.main' }}><MenuIcon /></IconButton>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <ConsortiumDropdown />
                </Box>
                <Typography noWrap sx={{ display: { xs: 'none', md: 'block' }, maxWidth: 260, color: 'text.secondary', fontSize: 14 }}>{user.email}</Typography>
                <Tooltip title="Menú de usuario">
                    <IconButton aria-label="Menú de usuario" onClick={event => setUserMenuAnchor(event.currentTarget)} sx={{ color: 'primary.main' }}><BsPeopleCircle /></IconButton>
                </Tooltip>
                <Menu anchorEl={userMenuAnchor} open={Boolean(userMenuAnchor)} onClose={() => setUserMenuAnchor(null)}>
                    <MenuItem onClick={logout}><Logout fontSize="small" sx={{ mr: 1 }} />Cerrar sesión</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
        <Box component="nav" aria-label="Navegación principal">
            <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 0 } }} open>{drawerContent}</Drawer>
            <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 0 } }}>{drawerContent}</Drawer>
        </Box>
    </> : null;


}

export default AppliactionNavView