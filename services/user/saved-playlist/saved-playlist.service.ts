import api from '@/api/interceptors';
import { SavedPlaylist } from './saved-playlist.types';

export const savedPlaylistService = {
	async getMany(take?: number) {
		return await api.get<SavedPlaylist[]>(
			`user/saved-playlist?take=${take ? take : ''}`
		);
	},

	async save(playlistId: number) {
		return await api.post<void>(`user/saved-playlist/${playlistId}`);
	},

	async remove(playlistId: number) {
		return await api.delete<void>(`user/saved-playlist/${playlistId}`);
	}
};
