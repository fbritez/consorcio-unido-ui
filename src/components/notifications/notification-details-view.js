import React, { useState, useEffect } from 'react';
import { Box, Chip, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { Favorite, FavoriteBorder, ThumbUpAlt, ThumbUpAltOutlined } from '@mui/icons-material';
import { Card, Button } from '../common/mui-components';
import { DownloadButton } from '../common/buttons';
import { downloadTicket } from '../utils/download-files';


const NotificatioDetailsView = props => {

    const defaultValue = 150;
    const notification = props.notification;
    const userEmail = props.userEmail;
    const [ text, setText ] = useState(notification.message);
    const [useSmallText, setUseSmallText ] = useState(true);
    const [reaction, setReaction] = useState(notification.userReaction || null);
    const [reactionCounts, setReactionCounts] = useState({
        like: notification.reactions?.like || 0,
        heart: notification.reactions?.heart || 0,
    });
    const [loading, setLoading] = useState(false);

    const shoudlUseSmallText = () => notification.message.length > defaultValue;

    const detectCharacterCounter = () => (useSmallText && shoudlUseSmallText()) ? defaultValue : notification.message.length;

    useEffect(async () => {
        const characterCount = detectCharacterCounter()
        const newString = notification.message.substring(0,characterCount);
        setText(newString)
    }, [useSmallText]);

    useEffect(() => {
        if (notification.id && userEmail) {
            loadReactions();
        }
    }, [notification.id, userEmail]);

    const loadReactions = async () => {
        try {
            const params = new URLSearchParams({
                notificationId: notification.id,
                userEmail: userEmail
            });
            const response = await fetch(`/notification/reactions?${params}`);
            const data = await response.json();
            setReactionCounts(data.counts);
            setReaction(data.userReaction);
        } catch (error) {
            console.error('Error loading reactions:', error);
        }
    };

    const handleReactionToggle = async (nextReaction) => {
        if (!userEmail || !notification.id) return;

        setLoading(true);
        try {
            const body = {
                notificationId: notification.id,
                userEmail: userEmail,
                reactionType: nextReaction
            };

            const response = await fetch('/notification/reaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                await loadReactions();
            }
        } catch (error) {
            console.error('Error toggling reaction:', error);
        } finally {
            setLoading(false);
        }
    };

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
                    <Divider sx={{ mt: 1.5, mb: 0.75 }} />
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Tooltip title="Me gusta">
                            <IconButton
                                aria-label="Me gusta"
                                size="small"
                                onClick={() => handleReactionToggle('like')}
                                disabled={loading}
                                sx={{ color: reaction === 'like' ? 'primary.main' : 'text.secondary', backgroundColor: reaction === 'like' ? 'rgba(44, 64, 104, 0.08)' : 'transparent' }}
                            >
                                {reaction === 'like' ? <ThumbUpAlt fontSize="small" /> : <ThumbUpAltOutlined fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 16 }}>{reactionCounts.like}</Typography>
                        <Tooltip title="Me encanta">
                            <IconButton
                                aria-label="Me encanta"
                                size="small"
                                onClick={() => handleReactionToggle('heart')}
                                disabled={loading}
                                sx={{ ml: 1, color: reaction === 'heart' ? 'secondary.main' : 'text.secondary', backgroundColor: reaction === 'heart' ? 'rgba(201, 120, 74, 0.1)' : 'transparent' }}
                            >
                                {reaction === 'heart' ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 16 }}>{reactionCounts.heart}</Typography>
                    </Stack>
                </Card.Body>
            </Card>
        </Box>
    )
}

export default NotificatioDetailsView