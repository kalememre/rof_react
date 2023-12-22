// ** Axios Import
import axios from 'axios'

// ** Auth Config
import authConfig from '../configs/auth'
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
    baseURL: authConfig.apiEndpoint,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {

        // 401 Unauthorized
        if (error.response && error.response.status === 401) {
            toast.error("You'are not logged in");
            window.localStorage.removeItem('userData')
            window.localStorage.removeItem(authConfig.storageTokenKeyName)
            window.location.href = '/login'
        }

        // 403 Forbidden
        else if (error.response && error.response.status === 403) {
            toast.error("You don't have permission to perform this action");
        }

        else {
            toast.error(error.response.data);

            return Promise.reject(error);
        }
    }
);

export default axiosInstance;