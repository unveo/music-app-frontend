import { api } from '@/api/interceptors';
import type { LikedTrack } from './liked-track.types';
import type { TracksIds } from '@/services/track/track.types';

export const likedTrackService = {
	async getMany(take?: number) {
		return await api.get<LikedTrack[]>(
			`user/liked-track?take=${take ? take : ''}`
		);
	},

	async getManyIds(trackIdToExclude: number) {
		return await api.get<TracksIds>(
			`user/liked-track/ids?trackIdToExclude=${trackIdToExclude ? trackIdToExclude : ''}`
		);
	},

	async add(trackId: number) {
		return await api.post<void>(`user/liked-track/${trackId}`);
	},

	async remove(trackId: number) {
		return await api.delete<void>(`user/liked-track/${trackId}`);
	}
};
