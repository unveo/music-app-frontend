import { api } from '@/api/interceptors';
import type {
	Album,
	AlbumFull,
	CreateAlbumDto,
	UpdateAlbumDto
} from './album.types';

export const albumService = {
	async getOneFull(username: string, changeableId: string) {
		return await api.get<AlbumFull>(
			`/album/?username=${username}&changeableId=${changeableId}`
		);
	},

	async getMany(userId: number, take?: number, lastId?: number) {
		return await api.get<Album[]>(
			`/album/many/?userId=${userId}&take=${take ? take : ''}&lastId=${lastId ? lastId : ''}`
		);
	},

	async create(dto: CreateAlbumDto) {
		return await api.post<AlbumFull>('/album', dto);
	},

	async update(albumId: number, dto: UpdateAlbumDto) {
		return await api.patch<Album>(`/album/${albumId}`, dto);
	},

	async delete(albumId: number) {
		return await api.delete<void>(`/album/${albumId}`);
	}
};
