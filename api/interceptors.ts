import axios, { AxiosError, CreateAxiosDefaults } from 'axios';

export const REFRESH_TOKEN = 'refreshToken';

const options: CreateAxiosDefaults = {
	baseURL: 'http://localhost:5000/api',
	withCredentials: true
};

const api = axios.create(options);

api.interceptors.response.use(
	(config) => config,
	async (error: AxiosError) => {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
);

// api.interceptors.response.use(
//   (config) => config,
//   async (error) => {
//     const originalRequest = error.config;
//     if (
//       error.response?.status === 401 &&
//       originalRequest &&
//       !originalRequest._isRetry
//     ) {
//       originalRequest._isRetry = true;
//       try {
//         await authService.refresh();
//         return await api.request(originalRequest);
//       } catch (err: any) {
//         throw err;
//       }
//     }
//     throw error;
//   }
// );

export default api;
