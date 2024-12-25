import { baseUrl } from '@/config';
import { authService } from '@/services/auth/auth.service';
import axios, { AxiosError, CreateAxiosDefaults } from 'axios';

const options: CreateAxiosDefaults = {
	baseURL: `${baseUrl.backend}/api`,
	withCredentials: true
};

export const apiWithoutAuth = axios.create(options);
export const api = axios.create(options);

let isRefreshing = false;
let requests: Array<() => void> = [];

api.interceptors.response.use(
	(config) => config,
	async (error: any) => {
		const originalRequest = error.config;
		if (
			error.response?.status === 401 &&
			((error.response?.data?.message === 'Unauthorized' &&
				!error.response?.data?.error) ||
				error.response?.data?.message === 'Invalid user') &&
			originalRequest &&
			!originalRequest._isRetry
		) {
			originalRequest._isRetry = true;

			if (!isRefreshing) {
				isRefreshing = true;
				try {
					await authService.refresh();
					isRefreshing = false;
					requests.forEach((request) => request());
					requests = [];

					return await api.request(originalRequest);
				} catch (err) {
					isRefreshing = false;
					requests = [];
					window.location.href = '/login';
					throw err;
				}
			} else {
				return new Promise((resolve) => {
					requests.push(() => {
						resolve(api.request(originalRequest));
					});
				});
			}
		}
		throw error;
	}
);
