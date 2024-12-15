import api from '@/api/interceptors';
import type {
	CreatePlaylistDto,
	Playlist,
	PlaylistFull,
	PlaylistWithUsername,
	UpdatePlaylistDto
} from './playlist.types';

export const playlistService = {
	async getOneFull(playlistId: number) {
		return await api.get<PlaylistFull>(`/playlist/${playlistId}`);
	},

	async getMany(userId?: number, take?: number) {
		return await api.get<PlaylistWithUsername[]>(
			`/playlist/?userId=${userId && userId}&take=${take ? take : ''}`
		);
	},

	async create(dto: CreatePlaylistDto) {
		return await api.post<Playlist>('/playlist', dto);
	},

	async update(playlistId: number, dto: UpdatePlaylistDto) {
		return await api.patch<Playlist>(`/playlist/${playlistId}`, dto);
	},

	async delete(playlistId: number) {
		return await api.delete<void>(`/playlist/${playlistId}`);
	}
};
