import React, { useState, useContext } from 'react';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { Card } from '../common/mui-components';
import { BasicAddItemButton, FileUploaderButton } from '../common/buttons';
import claimService from '../../services/claims-service/claims-service';
import imageService from '../../services/image-service/image-service';
import FileSelectedItem from '../utils/file-selected-ite';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import ErrorHandler from '../common/handlers/error-handler';
import { UserContext } from '../user-provider/user-provider';
import { ClaimContext } from './claim-provider';


const AddClaimView = () => {

    const { consortium } = useContext(ConsortiumContext);
    const { user } = useContext(UserContext);
    const { setClaim } = useContext(ClaimContext);
    const [selectedFile, setSelectedFile] = useState();
    const [message, setMessage] = useState({ title: '', message: '' });
    const [wrongTransaction, setWrongTransaction] = useState(false);

    const handleChange = (newValue) => {
        const updatedMessage = {
            ...message,
            ...newValue
        }
        setMessage(updatedMessage)
    }

    const save = () => {
        const claim = {
            consortium_id: consortium.id,
            owner: consortium.getMember(user).member_name,
            title: message.title,
            messages: [{ owner: consortium.getMember(user).member_name, message: message.message, filename: selectedFile?.name }]
        };
        claimService.save(claim).then(
            () => {
                imageService.save(selectedFile).then(
                    () => {
                        setMessage({title: '', message: ''})
                        setSelectedFile(undefined)
                        setClaim(claim)
                    },
                    () => {
                        setWrongTransaction(true);
                    },
                )
            }, () => { setWrongTransaction(true); })
    }

    const onFileChange = fileUploaded => {
        handleChange({ filename: fileUploaded.name })
        setSelectedFile(fileUploaded)
    }

    const errorDescriptions = [{
        value: wrongTransaction,
        description: 'La operacion no pudo ser completada. Por favor vuelva a intentarlo'
    }]

    const isComplete = Boolean(message.title.trim() && message.message.trim());

    return (
        <Box>
            <Typography variant="h6" color="primary.dark" sx={{ mb: 1.5 }}>crear nuevo reclamo</Typography>
            <ErrorHandler errors={errorDescriptions} />
            <Card>
                <Card.Body sx={{ p: 2 }}>
                        <Stack spacing={1.5}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Título"
                                data-testid='title'
                                onChange={event => handleChange({ title: event.target.value })}
                                value={message.title}
                            />
                            <TextField
                                fullWidth
                                multiline
                                minRows={4}
                                size="small"
                                label="Describe el problema"
                                data-testid='description'
                                onChange={event => handleChange({ message: event.target.value })}
                                value={message.message}
                            />
                            <BasicAddItemButton
                                description={'Crear reclamo'}
                                disabled={!isComplete}
                                onClick={() => save()} />
                            <FileUploaderButton handleFile={onFileChange} />
                            <FileSelectedItem selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                        </Stack>
                </Card.Body>
            </Card>
        </Box>
    )
}

export default AddClaimView