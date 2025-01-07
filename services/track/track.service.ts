import { api } from '@/api/interceptors';
import type {
	Track,
	TracksCreatedCount,
	TracksIds,
	TrackWithLiked,
	UpdateTrackDto,
	UploadTrackDto
} from './track.types';

export const trackService = {
	async streamAudio(trackId: number) {
		return await api.get(`/track/stream/${trackId}`);
	},

	async getOneById(trackId: number) {
		return await api.get<TrackWithLiked>(`/track/oneById/${trackId}`);
	},

	async getOne(username: string, changeableId: string) {
		return await api.get<TrackWithLiked>(
			`/track/one/?username=${username}&changeableId=${changeableId}`
		);
	},

	async getMany(userId: number, take?: number, lastId?: number) {
		return await api.get<TrackWithLiked[]>(
			`/track/?userId=${userId}&take=${take ? take : ''}&lastId=${lastId ? lastId : ''}`
		);
	},

	async getManyPopular(userId: number, take?: number, lastId?: number) {
		return await api.get<TrackWithLiked[]>(
			`/track/popular/?userId=${userId}&take=${take ? take : ''}&lastId=${lastId ? lastId : ''}`
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

	async addPlay(trackId: number) {
		return await api.patch<void>(`/track/${trackId}/add-play`);
	},

	async update(trackId: number, dto: UpdateTrackDto) {
		return await api.patch<Track>(`/track/${trackId}`, dto);
	},

	async delete(trackId: number) {
		return await api.delete<void>(`/track/${trackId}`);
	}
};
