import { api } from '@/api/interceptors';
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

	async getMany(take?: number, lastId?: number) {
		return await api.get<UserPublic[]>(
			`/user?take=${take ? take : ''}?lastId=${lastId ? lastId : ''}`
		);
	},

	async getRecommended() {
		return await api.get<UserPublic[]>('/user/recommended');
	},

	async update(dto: ChangeImageDto | ChangeUsernameDto) {
		return await api.patch<void>('/user', dto);
	},

	async delete() {
		return await api.delete<void>('/user');
	}
};
