import { api } from '@/api/interceptors';
import type { SavedPlaylist } from './saved-playlist.types';

export const savedPlaylistService = {
	async getMany(take?: number, lastId?: number) {
		return await api.get<SavedPlaylist[]>(
			`user/saved-playlist?take=${take ? take : ''}&lastId=${lastId ? lastId : ''}`
		);
	},

	async save(playlistId: number) {
		return await api.post<void>(`user/saved-playlist/${playlistId}`);
	},

	async remove(playlistId: number) {
		return await api.delete<void>(`user/saved-playlist/${playlistId}`);
	}
};
