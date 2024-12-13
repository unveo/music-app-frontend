import api from '@/api/interceptors';
import type {
	ChangeImageDto,
	ChangeUsernameDto,
	UserPrivate,
	UserPublic
} from './user.types';

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

	async update(dto: ChangeImageDto | ChangeUsernameDto) {
		return await api.patch<void>('/user', dto, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});
	},

	async delete() {
		return await api.delete<void>('/user');
	}
};
