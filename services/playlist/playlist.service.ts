import { api } from '@/api/interceptors';
import type {
	CreatePlaylistDto,
	Playlist,
	PlaylistFull,
	PlaylistWithIsSaved,
	UpdatePlaylistDto
} from './playlist.types';

export const playlistService = {
	async getOneFull(username: string, changeableId: string) {
		return await api.get<PlaylistFull>(
			`/playlist?username=${username}&changeableId=${changeableId}`
		);
	},

	async getMany(userId: number, take?: number, lastId?: number) {
		return await api.get<Playlist[]>(
			`/playlist/many?userId=${userId}&take=${take ? take : ''}&lastId=${lastId ? lastId : ''}`
		);
	},

	async getManyWithSaved(take?: number, lastId?: number) {
		return await api.get<PlaylistWithIsSaved[]>(
			`/playlist/many-with-saved?take=${take ? take : ''}&lastId=${lastId ? lastId : ''}`
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
