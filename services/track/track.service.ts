import api from '@/api/interceptors';
import type {
	Track,
	TracksCreatedCount,
	TracksIds,
	UpdateTrackDto,
	UploadTrackDto,
	UploadTracksDto
} from './track.types';

export const trackService = {
	async streamAudio(trackId: number) {
		return await api.get(`/track/stream/${trackId}`);
	},

	async getOne(trackId: number) {
		return await api.get<Track>(`/track/one/${trackId}`);
	},

	async getMany(userId?: number, take?: number, sort?: 'popular') {
		return await api.get<Track[]>(
			`/track/?userId=${userId && userId}&take=${take ? take : ''}&sort=${sort ? sort : ''}`
		);
	},

	async getManyIds(userId: number, trackIdToExclude: number) {
		return await api.get<TracksIds>(
			`/track/ids/?userId=${userId}&trackIdToExclude=${trackIdToExclude ? trackIdToExclude : ''}`
		);
	},

	async upload(dto: UploadTrackDto) {
		return await api.post<Track>('/track', dto);
	},

	async uploadForAlbum(dto: UploadTracksDto) {
		return await api.post<TracksCreatedCount>('/track/for-album', dto);
	},

	async addPlay(trackId: number) {
		return await api.post<void>(`/track/${trackId}/add-play`);
	},

	async update(trackId: number, dto: UpdateTrackDto) {
		return await api.patch<Track>(`/track/${trackId}`, dto);
	},

	async delete(trackId: number) {
		return await api.delete<void>(`/track/${trackId}`);
	}
};
