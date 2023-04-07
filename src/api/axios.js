import axios from 'axios';
const BASE_URL = 'http://ec2-35-153-40-171.compute-1.amazonaws.com:3002/api/v1';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});