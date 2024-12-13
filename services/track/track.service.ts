import api from '@/api/interceptors';
import type {
	Track,
	TracksCreatedCount,
	TrackWithUsername,
	UpdateTrackDto,
	UploadTrackDto,
	UploadTracksDto
} from './track.types';

export const trackService = {
	async streamAudio(trackId: number) {
		return await api.get(`/track/stream/${trackId}`);
	},

	async getOne(trackId: number) {
		return await api.get<TrackWithUsername>(`/track/${trackId}`);
	},

	async getMany(userId?: number, take?: number) {
		return await api.get<TrackWithUsername[]>(
			`/track/?userId=${userId && userId}&take=${take && take}`
		);
	},

	async getMostPopular(userId?: number, take?: number) {
		return await api.get<TrackWithUsername[]>(
			`/track/most-popular/?userId=${userId && userId}&take=${take && take}`
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
