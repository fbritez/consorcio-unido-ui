import React, { useState, useEffect } from 'react';
import { Box, Chip, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { Favorite, FavoriteBorder, ThumbUpAlt, ThumbUpAltOutlined } from '@mui/icons-material';
import { Card, Button } from '../common/mui-components';
import { DownloadButton } from '../common/buttons';
import { downloadTicket } from '../utils/download-files';


const NotificatioDetailsView = props => {

    const defaultValue = 150;
    const notification = props.notification;
    const [ text, setText ] = useState(notification.message);
    const [useSmallText, setUseSmallText ] = useState(true);
    const [reaction, setReaction] = useState(notification.userReaction || null);
    const [reactionCounts, setReactionCounts] = useState({
        like: notification.reactions?.like || 0,
        heart: notification.reactions?.heart || 0,
    });

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

    const toggleReaction = nextReaction => {
        setReactionCounts(previousCounts => {
            const nextCounts = { ...previousCounts };

            if (reaction) {
                nextCounts[reaction] = Math.max(0, nextCounts[reaction] - 1);
            }

            if (reaction !== nextReaction) {
                nextCounts[nextReaction] += 1;
            }

            return nextCounts;
        });
        setReaction(reaction === nextReaction ? null : nextReaction);
    };

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
                                onClick={() => toggleReaction('like')}
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
                                onClick={() => toggleReaction('heart')}
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