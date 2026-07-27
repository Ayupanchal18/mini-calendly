import axios from 'axios';

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const baseApiClient = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

baseApiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-access-token'] = token;
        }
        return config;
    }
);

export default baseApiClient;