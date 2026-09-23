import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Typography, Container, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Link } from '@mui/material';
import { UserContext } from '../user-provider/user-provider';
import { Card, Form, Button, Alert } from '../common/mui-components';
import logo from '../../images/medium-icon.png';
import loginService from '../../services/login-service/login-service';
import userService from '../../services/user-service/user-service';
import { PathContext } from '../main/path-provider';
import { notifications } from '../main/routes';
import { EmailField, isValidEmail } from '../common/email-field';

const service = loginService;

function Login() {

    const [email, setEmail] = useState();
    const [disableEmail, setDisableEmail] = useState(false);
    const [firstLogin, setFirstLogin] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [openContact, setOpenContact] = useState(false);
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const { setUser } = useContext(UserContext);
    const { setPath } = useContext(PathContext);

    const validateEmail = async (email) => {
        if (!isValidEmail(email || '')) {
            setValidEmail(false);
            setLoaded(true);
            return;
        }

        let response = await service.validateEmail(email);
        setValidEmail(response.validEmail);
        setFirstLogin(response.firstLogin);
        setLoaded(true);
        setDisableEmail(response.validEmail);
    }

    const setCredentials = () => {
        if (password === confirmPassword) {
            service.setCredentials(email, password).then(() => {redirectToMain(email)});
        } else {
            setInvalidPassword(true);
        }
    }

    const redirectToMain = async (email) => {
        const loggedUser = await userService.getUser(email);
        setUser(loggedUser);
        setPath(notifications());
    }

    const authenticate = async () => {
        const result = await service.authenticate(email, password);
        setInvalidPassword(!result);
        return result
    }

    const processAuthentication = async () => {
        const isAuthenticated = await authenticate();
        isAuthenticated && redirectToMain(email);
    }

    const clean = () => {
        setValidEmail(false);
        setFirstLogin(false);
        setLoaded(false);
        setDisableEmail(false);
    }

    const handleContactOpen = () => {
        setOpenContact(true);
    }

    const handleContactClose = () => {
        setOpenContact(false);
        setContactName('');
        setContactEmail('');
        setContactMessage('');
    }

    const handleContactSubmit = async () => {
        try {
            await service.sendContactMessage({
                name: contactName,
                email: contactEmail,
                message: contactMessage
            });
            handleContactClose();
        } catch (error) {
            console.error('Error sending contact message:', error);
        }
    }

    useEffect(() => {
    }, [validEmail, firstLogin]);

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
            '&:hover fieldset': { borderColor: '#FFFFFF' },
            '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
        },
        '& .MuiInputBase-input': { color: '#1B2945' },
        '& .MuiInputBase-input::placeholder': { color: '#5A6B8C', opacity: 1 },
        '& .MuiInputLabel-root': { color: '#FFFFFF' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#FFFFFF' },
    };

    return (
        <Box sx={{ minHeight: '100vh', background: '#EEE9D5', py: 4 }}>
            <Container maxWidth="lg" sx={{ height: '100%' }}>
                <Grid container spacing={4} sx={{ minHeight: 'calc(100vh - 32px)', alignItems: 'center', justifyContent: 'center' }}>

                    <Grid item xs={12} sm={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ textAlign: 'center', color: '#2C4068' }}>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: '#2C4068' }}>
                                Bienvenido
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, color: '#2C4068' }}>
                                Plataforma de Gestión de Consorcios
                            </Typography>
                            <Box
                                component="img"
                                src={logo}
                                alt="Consorcio Unido"
                                sx={{
                                    width: 200,
                                    height: 150,
                                    objectFit: 'contain',
                                    mb: 4,
                                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                                }}
                            />
                            <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 400, mx: 'auto', color: '#2C4068' }}>
                                Accede a tu cuenta para gestionar tu consorcio de manera eficiente y segura
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6}>
                        <Card sx={{
                            width: '100%',
                            p: { xs: 2, sm: 3 },
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            borderRadius: 2,
                            backgroundColor: '#2C4068'
                        }}>
                            <Card.Body>
                                <Box sx={{ mb: 3 }}>
                                    <Card.Title sx={{ fontSize: '1.5rem', color: 'white' }}>
                                        Inicia Sesión
                                    </Card.Title>
                                </Box>
                                <Card.Text sx={{ color: 'white' }}>
                                    {!validEmail && (
                                        <div>
                                            <Form.Group controlId="" sx={{ width: '100%', mb: 3 }}>
                                                <Form.Label sx={{ color: 'white' }}>Correo electrónico</Form.Label>
                                                <EmailField fullWidth sx={inputStyles} data-testid='email' placeholder="nombre@correo.com" required value={email || ''} onChange={event => setEmail(event.target.value)} disabled={disableEmail} />
                                            </Form.Group>
                                            {
                                                !validEmail && loaded &&
                                                <div>
                                                    <Alert variant='danger'>
                                                        El correo indicado no pertenece a ningún consorcio ni administración. Por favor, contacta con tu administrador o con nosotros.
                                                    </Alert>
                                                </div>
                                            }
                                            <Button data-testid='siguiente' sx={{ mb: 1, width: '100%', transition: 'none', color: 'white', backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }, '&.Mui-disabled': { backgroundColor: '#1B2945', color: 'rgba(255,255,255,0.45)' } }} onClick={() => validateEmail(email)} disabled={!isValidEmail(email || '')}>
                                                Siguiente
                                            </Button>
                                        </div>
                                    )}
                                    {validEmail && firstLogin && (
                                        <div>
                                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: 'white' }}>
                                                Crea tu contraseña
                                            </Typography>
                                            <Form.Group controlId="formBasicPassword">
                                                <Form.Label sx={{ color: 'white' }}>Ingrese su nuevo password</Form.Label>
                                                <Form.Control sx={inputStyles} type="password" placeholder="Password" onChange={event => { setPassword(event.target.value) }} />
                                            </Form.Group>
                                            <Form.Group controlId="formConfirmPassword">
                                                <Form.Label sx={{ color: 'white' }}>Confirme su nuevo password</Form.Label>
                                                <Form.Control sx={inputStyles} type="password" placeholder="Confirmar Password" onChange={event => { setConfirmPassword(event.target.value) }} />
                                            </Form.Group>
                                            {
                                                invalidPassword &&
                                                <div>
                                                    <Alert variant='warning'>
                                                        Las contraseñas ingresadas no coinciden.
                                                    </Alert>
                                                </div>
                                            }
                                            <Button sx={{ mb: 1, width: '100%', transition: 'none', color: 'white', backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }} onClick={setCredentials}>
                                                Confirmar
                                            </Button>
                                        </div>
                                    )}
                                    {validEmail && !firstLogin && (
                                        <div>
                                            <Form.Group controlId="formBasicPassword">
                                                <Form.Label sx={{ color: 'white' }}>Contraseña</Form.Label>
                                                <Form.Control sx={inputStyles} data-testid='password' type="password" placeholder="Password" onChange={event => { setPassword(event.target.value) }} />
                                            </Form.Group>
                                            {
                                                invalidPassword &&
                                                <Alert variant='danger' sx={{ mb: 2 }}>
                                                    Contraseña incorrecta
                                                </Alert>
                                            }
                                            <Button data-testid='login' sx={{ mb: 1, width: '100%', transition: 'none', color: 'white', backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }} onClick={() => processAuthentication()}>
                                                Ingresar
                                            </Button>
                                            <Button variant="secondary" sx={{ mb: 1, width: '100%', transition: 'none', color: 'white', backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }} onClick={() => clean()}>
                                                Usar otro correo
                                            </Button>
                                        </div>
                                    )}
                                </Card.Text>
                            </Card.Body>
                        </Card>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Link
                                component="button"
                                variant="body2"
                                onClick={handleContactOpen}
                                sx={{
                                    color: '#2C4068',
                                    textDecoration: 'none',
                                    fontSize: '0.95rem',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                ¿Necesitas ayuda? Contacta con los administradores
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <Dialog open={openContact} onClose={handleContactClose} maxWidth="sm" fullWidth>
                <DialogTitle>Contactar a los Administradores</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        fullWidth
                        label="Nombre"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        margin="normal"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#FFFFFF',
                                '& fieldset': { borderColor: '#333333' }
                            },
                            '& .MuiInputBase-input': { color: '#000000' }
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Correo electrónico"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        margin="normal"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#FFFFFF',
                                '& fieldset': { borderColor: '#333333' }
                            },
                            '& .MuiInputBase-input': { color: '#FFFFFF' }
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Mensaje"
                        multiline
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        margin="normal"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#FFFFFF',
                                '& fieldset': { borderColor: '#333333' }
                            },
                            '& .MuiInputBase-input': { color: '#000000' }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="secondary" onClick={handleContactClose} sx={{ transition: 'none' }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleContactSubmit} sx={{ transition: 'none', backgroundColor: '#999999', color: 'white', '&:hover': { backgroundColor: '#777777' } }}>
                        Enviar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Login