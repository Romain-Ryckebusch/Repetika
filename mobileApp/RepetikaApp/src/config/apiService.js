import axios from 'axios';
import config from './config';

const api = axios.create({
    baseURL: config.BASE_URL,
    timeout: 5000,
});


export default api;