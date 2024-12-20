import api from '@/api/interceptors';
import type {
	CreatePlaylistDto,
	Playlist,
	PlaylistFull,
	UpdatePlaylistDto
} from './playlist.types';

export const playlistService = {
	async getOneFull(username: string, changeableId: string) {
		return await api.get<PlaylistFull>(
			`/playlist/?username=${username ? username : ''}&changeableId=${changeableId ? changeableId : ''}`
		);
	},

	async getMany(userId?: number, take?: number) {
		return await api.get<Playlist[]>(
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
