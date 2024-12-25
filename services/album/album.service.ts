import { api } from '@/api/interceptors';
import type {
	Album,
	AlbumFull,
	CreateAlbumDto,
	UpdateAlbumDto
} from './album.types';

export const albumService = {
	async getOneFull(albumId: number) {
		return await api.get<AlbumFull>(`/album/${albumId}`);
	},

	async getMany(userId?: number, take?: number) {
		return await api.get<Album[]>(
			`/album/?userId=${userId && userId}&take=${take ? take : ''}`
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
