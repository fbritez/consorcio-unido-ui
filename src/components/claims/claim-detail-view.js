import React, { useState, useContext } from 'react';
import { Box, Divider, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { Card } from '../common/mui-components';
import { BasicAddItemButton, DownloadButton, FileUploaderButton } from '../common/buttons';
import FileSelectedItem from '../utils/file-selected-ite';
import { downloadTicket } from '../utils/download-files';
import claimService from '../../services/claims-service/claims-service';
import imageService from '../../services/image-service/image-service';
import { ClaimContext } from './claim-provider';
import { FaBuilding, FaUserAlt } from "react-icons/fa";
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import { UserContext } from '../user-provider/user-provider';
import ErrorHandler from '../common/handlers/error-handler';
import StateBadge from './state-badge-view';


const ClaimDetailsView = () => {

    const { claim, setClaim } = useContext(ClaimContext);
    const { user } = useContext(UserContext);
    const { consortium } = useContext(ConsortiumContext);
    const [selectedFile, setSelectedFile] = useState();
    const [wrongTransaction, setWrongTransaction] = useState(false);
    const [message, setMessage] = useState(undefined);

    const save = () => {
        const owner = detectUser()
        claim.state = !isClose() ? consortium.isAdministrator(user) ? 'Pending Owner' : 'Pending Admin' : claim.state
        const newMessage = { message: message, filename: selectedFile?.name, owner: owner }

        claim.messages = claim.messages.reverse()
        claim.messages.push(newMessage)
        claim.messages = claim.messages.reverse()
        claimService.save(claim).then(
            () => {
                imageService.save(selectedFile).then(
                    () => {
                        setMessage('')
                        setSelectedFile(undefined)
                        setClaim({})
                        setClaim(claim)
                    },
                    () => {
                        setWrongTransaction(true);
                    },
                )
            }, () => { setWrongTransaction(true); })
    }

    const errorDescriptions = [{
        value: wrongTransaction,
        description: 'La operacion no pudo ser completada. Por favor vuelva a intentarlo'
    }]

    const onFileChange = fileUploaded => {
        setSelectedFile(fileUploaded)
    }

    const close = async () => {
        claim.state = 'Close';
        setClaim(claim);
        const newMessage = { message: 'RECLAMO CERRADO', filename: selectedFile?.name, owner: detectUser() }
        claim.messages = claim.messages.reverse()
        claim.messages.push(newMessage)
        claim.messages = claim.messages.reverse()
        claimService.save(claim).then(
            () => {
                setMessage('')
                setSelectedFile(undefined)
                setClaim({})
                setClaim(claim)
            },
            () => {
                setWrongTransaction(true);
            },
        )
    }

    const isClose = () => claim?.state == 'Close'

    const detectUser = () => consortium.isAdministrator(user) ? user.email : consortium.getMember(user).member_name

    const detectAdminIcon = owner => consortium.isAdministrator({ email: owner }) ? <FaBuilding /> : <FaUserAlt />

    const detectOwnerDescription = owner => consortium.isAdministrator({ email: owner }) ? 'Administración' : claim.owner

    return (
        <Box sx={{ mb: 1 }}>
            <ErrorHandler errors={errorDescriptions} />
            <Card sx={{ overflow: 'hidden' }}>
                <Card.Body sx={{ p: { xs: 2, md: 3 } }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                        <Box>
                            <Typography variant="overline" color="text.secondary">{claim?.identifier}</Typography>
                            <Typography variant="h6" color="primary.dark">{claim?.title}</Typography>
                            <Typography variant="body2" color="text.secondary">Unidad funcional: {claim.owner}</Typography>
                        </Box>
                        <Stack alignItems="flex-end" spacing={1}>
                            <StateBadge state={claim?.state} />
                            {!isClose() && <Tooltip title="Cerrar reclamo"><IconButton aria-label="Cerrar reclamo" size="small" onClick={close} color="error"><Close /></IconButton></Tooltip>}
                        </Stack>
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                        <React.Fragment>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                size="small"
                                label="Agregar respuesta"
                                data-testid='message'
                                value={message || ''}
                                disabled={isClose()}
                                onChange={event => setMessage(event.target.value)}
                            />
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                <BasicAddItemButton
                                    description={'Enviar respuesta'}
                                    disabled={!message}
                                    onClick={() => save()}
                                />
                                <FileUploaderButton disabled={isClose()} handleFile={onFileChange} />
                                <FileSelectedItem selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                            </Stack>
                        </React.Fragment>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight={700} color="primary.dark">Actividad</Typography>
                        <Divider sx={{ my: 1.5 }} />
                        {
                            claim?.messages?.map(message => {
                                return (
                                    <Box key={`${message.owner}-${message.date}-${message.message}`} sx={{ py: 1.5 }}>
                                        <Stack direction="row" justifyContent="space-between" spacing={2}>
                                            <Typography variant="body2" fontWeight={700}>{detectAdminIcon(message.owner)} {' '}{detectOwnerDescription(message.owner)}</Typography>
                                            <Typography variant="caption" color="text.secondary">{message.date}</Typography>
                                        </Stack>
                                        <Typography component="div" variant="body2" sx={{ whiteSpace: 'pre-line', mt: 0.75 }}>{message.message}</Typography>
                                        <Stack direction="row" justifyContent="flex-end">
                                            {message.filename && <DownloadButton onClick={() => downloadTicket(message.filename)} />}
                                        </Stack>
                                        <Divider sx={{ mt: 1.5 }} />
                                    </Box>
                                )
                            })
                        }
                    </Box>
                </Card.Body>
            </Card>
        </Box>
    )
}

export default ClaimDetailsView