import React, { useState, useEffect } from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { Modal } from '../../common/mui-components';
import { BasicAddItemButton } from '../../common/buttons';
import { EmailField, isValidEmail } from '../../common/email-field';

const MemberDetailsView = props => {

    const [updatedMember, setUpdatedMembers] = useState();

    useEffect(async () => {
        setUpdatedMembers(props.member)
    }, [props.member]);

    const handleChange = (values) => {
        const newMember = {
            ...updatedMember,
            ...values
        }
        setUpdatedMembers(newMember)
    }

    const raiseMemberUpdated = () => {
        if (updatedMember.secondary_email && !isValidEmail(updatedMember.secondary_email)) {
            return;
        }

        props.handleMemberChange(updatedMember)
        setUpdatedMembers(undefined)
    }

    return (
        <div>
            {
                updatedMember &&
                <Modal show={updatedMember} onHide={() => {}}>
                    <Modal.Header closeButton onClick={() => setUpdatedMembers(undefined)}>
                        <Modal.Title data-testid='title'>{`${updatedMember.member_name} - ${updatedMember.user_email}`}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Stack spacing={2}>
                            <Typography variant="body2" color="text.secondary">
                                Este correo también tendrá acceso al sistema.
                            </Typography>
                            <EmailField
                                fullWidth
                                size="small"
                                label="Correo secundario"
                                data-testid='secondary_email'
                                allowEmpty
                                value={updatedMember.secondary_email || ''}
                                onChange={event => handleChange({ 'secondary_email': event.target.value })}
                            />
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                size="small"
                                label="Notas"
                                data-testid='notes'
                                value={updatedMember.notes || ''}
                                onChange={event => handleChange({ 'notes': event.target.value })}
                            />
                            <BasicAddItemButton 
                                description={'Guardar cambios'}
                                onClick={raiseMemberUpdated}
                            />
                        </Stack>
                    </Modal.Body>
                </Modal>

            }
        </div>
    )
}



export default MemberDetailsView