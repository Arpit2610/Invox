import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000'
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    config => {
        const userInfo = localStorage.getItem('user');
        if (userInfo) {
            try {
                const { token } = JSON.parse(userInfo);
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                    console.log('Token being sent:', token);
                }
            } catch (error) {
                console.error('Error parsing user info:', error);
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.error('Response error:', error);
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/select-role';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 