import axios from "axios";

export const setAxiosInterceptors = () => {
    axios.interceptors.response.use(
        response => response, 
        error => {
            if (error.status === 403) {
                localStorage.clear();
                window.location.href = '/login';
                return;
            }
            return Promise.reject(error);
        }
    );
}
