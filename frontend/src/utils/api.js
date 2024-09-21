import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await api.post('/auth/refresh');
                localStorage.setItem('accessToken', data.accessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Handle refresh token error (e.g., logout user)
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;