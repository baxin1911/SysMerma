import { normalizeHttpError } from "../api/utils.js";

const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
});
let isRefreshing = false;
let queue = [];

api.interceptors.response.use(
    res => res,
    async err => {

        const original = err.config;

        if (err.response?.status === 401 && !original._retry) {

            original._retry = true;

            if (isRefreshing) return new Promise(resolve => {
                queue.push(() => resolve(api(original)));
            });

            isRefreshing = true;

            try {

                await axios.post("/api/auth/refresh", {}, { withCredentials: true });
                queue.forEach(cb => cb());
                queue = [];

                return api(original);

            } catch (refreshErr) {

                queue.forEach(p => p.reject(refreshErr));
                queue = [];

                window.location.href = '/';
                return Promise.reject(refreshErr);

            } finally {

                isRefreshing = false;
            }
        }

        return Promise.reject(normalizeHttpError(err));
    }
);

export const apiRequest = async ({ method, url, params, data }) => await api({ method, url, params, data });