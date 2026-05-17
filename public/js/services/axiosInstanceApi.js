import { normalizeHttpError } from "../api/utils.js";

const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
    withCredentials: true,
});
let isRefreshing = false;
let queue = [];

const resolveQueue = () => {
    queue.forEach(({ resolve, config }) => resolve(api(config)));
    queue = [];
}

const rejectQueue = (error) => {
    queue.forEach(({ reject }) => reject(error));
    queue = [];
}

api.interceptors.response.use(
    res => res,
    async err => {

        const original = err.config;

        if (err.response?.status === 401 && original && !original._retry) {

            original._retry = true;

            if (isRefreshing) return new Promise((resolve, reject) => {
                queue.push({ resolve, reject, config: original });
            });

            isRefreshing = true;

            try {

                await axios.post('/api/auth/refresh', {}, { withCredentials: true });
                resolveQueue();

                return api(original);

            } catch (refreshErr) {

                rejectQueue(refreshErr);

                window.location.href = '/';
                return Promise.reject(refreshErr);

            } finally {

                isRefreshing = false;
            }
        }

        return Promise.reject(normalizeHttpError(err));
    }
);

export const apiRequest = async ({ method, url, params, data, responseType }) => await api({ method, url, params, data, responseType });
