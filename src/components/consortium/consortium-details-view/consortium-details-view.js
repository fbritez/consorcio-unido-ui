import React, { useState, useContext, useEffect } from 'react';
import { Box, Button as MuiButton, Divider, Stack, TextField, Typography } from '@mui/material';
import { ConsortiumContext } from '../consortium-provider/consortium-provider';
import consortiumService from '../../../services/consortium-service/consortium-service';
import ConsortiumMembersTable from '../consortium-members-table/consortium-members-table';
import { Tabs, Tab, Alert } from '../../common/mui-components';
import { UserContext } from '../../user-provider/user-provider';
import settingService from '../../../services/setting-service/setting-service';

const service = consortiumService;

const BasicConsortiumDetails = props => {

    const { consortium } = useContext(ConsortiumContext);

    const name = () => consortium ? consortium.name : ''

    const address = () => consortium ? consortium.address : ''

    return (
        <Box>
            <Stack spacing={2.5}>
                <Box>
                    <Typography variant="subtitle1" fontWeight={700} color="primary.dark">Datos básicos</Typography>
                    <Typography variant="body2" color="text.secondary">Actualiza la información que identifica al consorcio.</Typography>
                </Box>
                <TextField
                    fullWidth
                    size="small"
                    label="Nombre o identificador del consorcio"
                data-testid='consortium-name'
                type="text"
                value={name()}
                onChange={event => props.handleChange({ 'name': event.target.value })}
            />
                <TextField
                    fullWidth
                    size="small"
                    label="Dirección"
                data-testid='consortium-address'
                type="text"
                value={address()}
                onChange={event => props.handleChange({ 'address': event.target.value })}
            />
                <Divider />
                <Box>
                    <Typography variant="subtitle1" fontWeight={700} color="primary.dark">Unidades funcionales</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>Administra los miembros asociados a este consorcio.</Typography>
                    <ConsortiumMembersTable setMembers={props.setUpdatedMembers} shouldRefresh={props.shouldRefresh} />
                </Box>
            </Stack>
        </Box>
    )
}

const AdvancedConsortiumDetails = props => {
    const { consortium } = useContext(ConsortiumContext);

    const memberValue = () => props.settings?.memberValues ? props.settings.memberValues : ' ';

    return (
        <Box>
            <Stack spacing={2.5}>
                <Box>
                    <Typography variant="subtitle1" fontWeight={700} color="primary.dark">Configuración avanzada</Typography>
                    <Typography variant="body2" color="text.secondary">Define cómo se organiza la información de los miembros.</Typography>
                </Box>
                <TextField
                    fullWidth
                    size="small"
                    label="Cantidad de miembros por tabla"
                type="number"
                    value={memberValue()}
                    onChange={event => props.handleSettingChange({ 'memberValues': event.target.value })}
                />
                {consortium?.id && <TextField
                    fullWidth
                    size="small"
                    label="ID del Consorcio"
                    type="text"
                    value={consortium.id}
                    InputProps={{ readOnly: true }}
                    data-testid='consortium-id'
                />}
            </Stack>
        </Box>
    )
}

const ConsortiumDetails = (props) => {

    const { consortium, setConsortium } = useContext(ConsortiumContext);
    const { user } = useContext(UserContext);
    const [updatedMembers, setUpdatedMembers] = useState()
    const [, setValid] = useState(false)
    const [actionDescription, setActionDescription] = useState();
    const [consortiumSettings, setConsortiumSettings] = useState();
    const [shouldRefresh, setShouldRefresh] = useState();

    useEffect(() => {
        setActionDescription(undefined);
        const fetchConsortiumSettings = async () => {
            const result = await settingService.getConsortiumSettings(consortium);
            setConsortiumSettings(result);
        };
        fetchConsortiumSettings();
    }, [consortium]);

    const handleChange = (values) => {
        const updatedItem = {
            ...consortium,
            ...values
        }
        setConsortium(service.createModel(updatedItem))
    }

    const handleSettingChange = (values) => {
        const updatedItem = {
            ...consortiumSettings,
            ...values
        }
        setConsortiumSettings(updatedItem)
    }

    const handleSubmit = async () => {
        consortium.addAdministrator(user.email);
        consortium.setMembers(updatedMembers);
        await service.update(consortium).then(
            () => {
                setConsortium(consortium);
                setValid(false)
                props.setUpdated(!props.updated)
                setActionDescription({ action: 'success', description: 'Los datos an sido guardados con exito' })
            },
            () => { setActionDescription({ action: 'danger', description: 'Los datos no se han guardado correctamente' }) });
        await settingService.update(consortiumSettings).then(
            () => {
                setValid(false)
                setShouldRefresh(!shouldRefresh)
                setActionDescription({ action: 'success', description: 'Los datos an sido guardados con exito' })
            },
            () => { setActionDescription({ action: 'danger', description: 'Los datos no se han guardado correctamente' }) });

    }

    return (
        <Box>
            {actionDescription && <Alert variant={actionDescription.action}>{actionDescription.description}</Alert>}
            <Box sx={{ mt: actionDescription ? 2 : 0 }}>
                <Tabs defaultActiveKey="basics">
                    <Tab eventKey="basics" title="Basicos">
                        <BasicConsortiumDetails
                            handleChange={handleChange}
                            setUpdatedMembers={setUpdatedMembers}
                            shouldRefresh={shouldRefresh} />
                    </Tab>
                    <Tab eventKey="advanced" title="Avanzados">
                        <AdvancedConsortiumDetails
                            settings={consortiumSettings}
                            setUpdated={props.setUpdated}
                            updated={props.updated}
                            setAction={setActionDescription}
                            handleSettingChange={handleSettingChange} />
                    </Tab>
                </Tabs>
                <MuiButton data-testid='save-button' variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                    Guardar cambios
                </MuiButton>
            </Box>
        </Box>
    )
}

export default ConsortiumDetails