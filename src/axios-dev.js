import axios from 'axios';

const instance = axios.create({
    withCredentials: true,
    // baseURL: 'http://localhost:3030'
    //  baseURL: 'http://628b79f9.ngrok.io'
    // baseURL: 'http://10.1.13.174:8080/'
    // baseURL: 'http://192.168.0.101:3030'
    baseURL: 'http://192.168.0.104:3030'
    // baseURL: 'http://192.168.0.105:3030/'
});
instance.defaults.headers.common['Authorization'] = 'AUTH_TOKEN_FROM_INSTANCE';

export default instance;