import api from '@/api/interceptors';
import type {
	ChangeEmailDto,
	ChangePasswordDto,
	LoginDto,
	RegisterDto
} from './auth.types';
import type { UserPrivate } from '../user/user.types';
import { AxiosError } from 'axios';

export const authService = {
	async register(dto: RegisterDto) {
		return await api.post<UserPrivate>('/auth/register', dto);
	},

	async login(dto: LoginDto) {
		return await api.post<UserPrivate>('/auth/login', dto);
	},

	async logout() {
		return await api.post<void>('/auth/logout');
	},

	async logoutAll() {
		return await api.post<void>('/auth/logout-all');
	},

	async refresh() {
		return await api.post<UserPrivate>('/auth/login/refresh');
	},

	async changeEmail(dto: ChangeEmailDto) {
		return await api.patch<UserPrivate>('/auth/email', dto);
	},

	async changePassword(dto: ChangePasswordDto) {
		return await api.patch<UserPrivate>('/auth/password', dto);
	}
};
