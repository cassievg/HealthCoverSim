import axios from 'axios';

const instance = axios.create({
    baseURL: '/api',
    timeout: 60000,
    withCredentials: true,
});

export default instance;
