import React, { useState } from 'react';
import { Add, PersonAddOutlined } from '@mui/icons-material';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { EmailField, isValidEmail } from '../../common/email-field';

const emptyMember = () => ({ member_name: '', user_email: '' })

const AddMemberView = (props) => {

    const [member, setMember] = useState(emptyMember());

    const handleChange = (newValue) => {
        const updatedMember = {
            ...member,
            ...newValue
        }
        setMember(updatedMember)
    }

    const addMember = () => {
        if (!member.member_name.trim() || !isValidEmail(member.user_email)) {
            return;
        }

        props.setMember(member)
        setMember(emptyMember())
    }

    const isComplete = Boolean(member.member_name.trim() && isValidEmail(member.user_email));

    return (
        <Box sx={{ mb: 2.5, p: { xs: 1.5, sm: 2 }, borderRadius: 1.5, backgroundColor: 'rgba(44, 64, 104, 0.04)', border: '1px solid', borderColor: 'rgba(44, 64, 104, 0.1)' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <PersonAddOutlined color="primary" fontSize="small" />
                <Box>
                    <Typography variant="subtitle2" color="primary.dark" fontWeight={700}>Agregar unidad funcional</Typography>
                    <Typography variant="caption" color="text.secondary">Completa ambos campos para incorporarla.</Typography>
                </Box>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                <TextField
                    fullWidth
                    size="small"
                    label="Unidad funcional"
                    data-testid="member_name_input"
                    value={member.member_name}
                    onChange={event => handleChange({ member_name: event.target.value })}
                />
                <EmailField
                    fullWidth
                    size="small"
                    label="Correo de contacto"
                    required
                    data-testid="user_email_input"
                    value={member.user_email}
                    onChange={event => handleChange({ user_email: event.target.value })}
                />
                <Button
                    data-testid="button"
                    variant="contained"
                    startIcon={<Add />}
                    onClick={addMember}
                    disabled={!isComplete}
                    sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                >
                    Agregar
                </Button>
            </Stack>
        </Box>
    )
}

export default AddMemberView