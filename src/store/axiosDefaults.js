// ** Axios Import
import axios from 'axios'

// ** Auth Config
import authConfig from '../configs/auth'

const axiosInstance = axios.create({
    baseURL: authConfig.apiEndpoint,
});

const getErrorMessage = (error) => {
    return !error.response.data.detail
        ? error.response.data.error.message
        : error.response.data.detail;
};

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response && error.response.status === 401) {
//             localStorage.clear()
//             throw Error(getErrorMessage(error))
//         }
//         else if (error.request) { throw Error(error.request) }
//         else { throw Error('An error occurred while making the request.') }
//     }
// );

export default axiosInstance;