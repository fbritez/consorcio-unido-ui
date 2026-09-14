import React, { useState, useEffect } from 'react';
import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import { Card, Button } from '../common/mui-components';
import { DownloadButton } from '../common/buttons';
import { downloadTicket } from '../utils/download-files';


const NotificatioDetailsView = props => {

    const defaultValue = 150;
    const notification = props.notification;
    const [ text, setText ] = useState(notification.message);
    const [useSmallText, setUseSmallText ] = useState(true);

    const shoudlUseSmallText = () => notification.message.length > defaultValue;

    const detectCharacterCounter = () => (useSmallText && shoudlUseSmallText()) ? defaultValue : notification.message.length;

    useEffect(async () => {
        const characterCount = detectCharacterCounter()
        const newString = notification.message.substring(0,characterCount);
        setText(newString)
    }, [useSmallText]);

    const formatDate = () => {
        const rawDate = notification.publishDate;
        const parsedDate = new Date(rawDate);

        if (!Number.isNaN(parsedDate.getTime())) {
            return new Intl.DateTimeFormat('es-AR', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(parsedDate);
        }

        return rawDate?.replace('GMT', '').substring(4) || 'Fecha no disponible';
    }

    return (
        <Box sx={{ mb: 2 }}>
            <Card sx={{ overflow: 'hidden', backgroundColor: '#FFFDF8' }}>
                <Card.Body sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
                            {formatDate()}
                        </Typography>
                        {notification.filename && <Chip label="Archivo adjunto" size="small" variant="outlined" color="primary" />}
                    </Stack>
                    <Divider sx={{ mb: 1.75 }} />
                    <Typography component="div" variant="body1" sx={{ whiteSpace: 'pre-line', color: 'text.primary', lineHeight: 1.65, overflowWrap: 'anywhere' }}>
                        {text}
                    </Typography>
                    {shoudlUseSmallText() && <Button
                        data-testid="button"
                        variant="link"
                        onClick={() => setUseSmallText(!useSmallText)}
                        sx={{ mt: 1, px: 0, minHeight: 30, fontSize: 13 }}
                    >
                        {useSmallText ? 'Leer más' : 'Mostrar menos'}
                    </Button>}
                    {notification.filename && <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
                        <DownloadButton onClick={() => downloadTicket(notification.filename)} />
                    </Stack>}
                </Card.Body>
            </Card>
        </Box>
    )
}

export default NotificatioDetailsView