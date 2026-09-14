import React, { useEffect, useState, useContext } from 'react';
import { Box, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import { UserContext } from '../user-provider/user-provider';
import claimService from '../../services/claims-service/claims-service';
import { ClaimContext } from './claim-provider';
import StateBadge from './state-badge-view';

const ClaimListView = props => {

    const { user } = useContext(UserContext);
    const { consortium } = useContext(ConsortiumContext);
    const [claims, setClaims] = useState([]);
    const { claim, setClaim } = useContext(ClaimContext);

    useEffect(async () => {
        if (consortium) {
            var data;
            const isAdmin = consortium.isAdministrator(user);
            if (isAdmin) {
                data = await claimService.getClaims(consortium);
            } else {
                const member = consortium.getMember(user)
                data = await claimService.claimsFor(consortium, member.member_name);
            }
            if(props.filterFuction) {
                data = data.filter(props.filterFuction)
            }
            data = data.reverse()
            setClaims(data)
        }
    }, [consortium, claim]);

    const handleClaim = claim => {
        setClaim(claim); 
        if(props.sideEffect){
            props.sideEffect()
        }
        
    }

    return (
        <Box className='scrollbar-dinamically'>
            <List disablePadding>
                {claims?.map(currentClaim => <ListItemButton
                    key={currentClaim.identifier}
                    selected={claim?.identifier === currentClaim.identifier}
                    onClick={() => handleClaim(currentClaim)}
                    sx={{ borderRadius: 1.5, mb: 0.75, px: 1.25, display: 'block', '&.Mui-selected': { backgroundColor: 'rgba(44, 64, 104, 0.1)' } }}
                >
                    <ListItemText
                        primary={<Typography variant="body2" fontWeight={700} noWrap>{currentClaim.identifier}</Typography>}
                        secondary={<Box sx={{ mt: 0.5 }}><StateBadge state={currentClaim?.state} /></Box>}
                    />
                </ListItemButton>)}
                {!claims?.length && <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>No hay reclamos para mostrar.</Typography>}
            </List>
        </Box>
    )
}

export default ClaimListView