import { api } from '@/api/interceptors';
import type { LikedAlbum } from './liked-album.types';

export const likedAlbumService = {
	async getMany(take?: number) {
		return await api.get<LikedAlbum[]>(
			`user/liked-album?take=${take ? take : ''}`
		);
	},

	async add(albumId: number) {
		return await api.post<void>(`user/liked-album/${albumId}`);
	},

	async remove(albumId: number) {
		return await api.delete<void>(`user/liked-album/${albumId}`);
	}
};
