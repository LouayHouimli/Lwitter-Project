import api from '../utils/api';

const testAuth = async () => {
    try {
        const response = await api.get('/auth/test-auth');
        console.log('Authentication successful:', response.data);
    } catch (error) {
        console.error('Authentication failed:', error);
    }
};