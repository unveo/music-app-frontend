import api from '@/api/interceptors';
import type { UpdateUserDto, UserPrivate, UserPublic } from './user.types';

export const userService = {
	async getCurrent() {
		return await api.get<UserPrivate>('/user/current');
	},

	async getByName(username: string) {
		return await api.get<UserPublic>(`/user/by-name/${username}`);
	},

	async getMany(take?: number) {
		return await api.get<UserPublic[]>(`/user?take=${take && take}`);
	},

	async update(dto: UpdateUserDto) {
		return await api.patch<void>('/user', dto);
	},

	async delete() {
		return await api.delete<void>('/user');
	}
};
