import axios from 'axios';

axios.defaults.withCredentials = true;

let sessionExpiredHandler = null;

const LOGIN_ENDPOINTS = ['/validateUserEmail', '/authenticate', '/setCredentials', '/session'];

const isLoginEndpoint = url => LOGIN_ENDPOINTS.some(endpoint => (url || '').includes(endpoint));

const onSessionExpired = handler => {
    sessionExpiredHandler = handler;
};

axios.interceptors.response.use(
    response => response,
    error => {
        if (error?.response?.status === 401 && sessionExpiredHandler
            && !isLoginEndpoint(error?.config?.url)) {
            sessionExpiredHandler();
        }
        return Promise.reject(error);
    }
);

export { onSessionExpired };
export default axios;
