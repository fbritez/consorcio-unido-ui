import React, { useState, useContext, useEffect } from 'react';
import { Avatar, Box, Button, Divider, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { BusinessOutlined, Check, KeyboardArrowDown } from '@mui/icons-material';
import { UserContext } from '../user-provider/user-provider';
import consortiumService from '../../services/consortium-service/consortium-service';
import { ConsortiumContext } from './consortium-provider/consortium-provider';

const service = consortiumService;

const ConsortiumDropdown = props => {

    const [consortiums, setConsortiums] = useState();
    const { consortium, setConsortium } = useContext(ConsortiumContext)
    const { user } = useContext(UserContext);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        let active = true;

        if (!user) {
            return undefined;
        }

        service.getConsortiums(user).then(listOfConsortium => {
            if (!active) {
                return;
            }

            setConsortiums(listOfConsortium);
            if (listOfConsortium.length === 1) {
                setConsortium(listOfConsortium[0]);
            }
        });

        return () => {
            active = false;
        };
    }, [props.updated, user]);

    const selectedName = consortium?.name || 'Seleccionar consorcio';
    const selectedInitial = selectedName.charAt(0).toUpperCase();

    return <>
        <Button
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl)}
            onClick={event => setAnchorEl(event.currentTarget)}
            startIcon={consortium ? <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', color: 'common.white', fontSize: 14, fontWeight: 700 }}>{selectedInitial}</Avatar> : <BusinessOutlined />}
            endIcon={<KeyboardArrowDown sx={{ transform: anchorEl ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }} />}
            sx={{
                minWidth: 0,
                maxWidth: { xs: 230, sm: 340 },
                justifyContent: 'space-between',
                color: 'primary.main',
                px: 1,
                py: 0.5,
                textAlign: 'left',
                '& .MuiButton-startIcon': { mr: 1 },
                '& .MuiButton-endIcon': { ml: 1 },
            }}
        >
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', lineHeight: 1.1, fontWeight: 600 }}>Consorcio activo</Typography>
                <Typography noWrap variant="body2" sx={{ display: 'block', maxWidth: { xs: 145, sm: 250 }, color: 'primary.dark', fontWeight: 800, lineHeight: 1.35 }}>{selectedName}</Typography>
            </Box>
        </Button>
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { mt: 1, minWidth: { xs: 280, sm: 360 }, maxWidth: 'calc(100vw - 32px)', border: '1px solid', borderColor: 'divider', boxShadow: '0 12px 30px rgba(27, 41, 69, 0.16)' } }}
        >
            <Box sx={{ px: 2, py: 1.25 }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>Cambiar consorcio</Typography>
            </Box>
            <Divider />
            {consortiums?.map(currentConsortium => <MenuItem
                key={currentConsortium.id || currentConsortium.name}
                selected={currentConsortium.id === consortium?.id}
                onClick={() => { setConsortium(currentConsortium); setAnchorEl(null); }}
                sx={{ alignItems: 'flex-start', py: 1.25, px: 2, whiteSpace: 'normal' }}
            >
                <ListItemIcon sx={{ minWidth: 38, mt: 0.25 }}><BusinessOutlined fontSize="small" /></ListItemIcon>
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight={700}>{currentConsortium.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', overflowWrap: 'anywhere' }}>{currentConsortium.address || 'Dirección no disponible'}</Typography>
                </Box>
                {currentConsortium.id === consortium?.id && <Check color="primary" fontSize="small" sx={{ ml: 1, mt: 0.25 }} />}
            </MenuItem>)}
        </Menu>
    </>
}

export default ConsortiumDropdown