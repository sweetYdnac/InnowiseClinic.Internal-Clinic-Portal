import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://localhost:10001',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});
