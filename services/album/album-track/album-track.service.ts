import { api } from '@/api/interceptors';
import type { TrackInAlbum, UpdateTrackPositionDto } from './album-track.types';
import type { TracksIds } from '@/services/track/track.types';

export const albumTrackService = {
	async getManyTracks(albumId: number, take?: number) {
		return await api.get<TrackInAlbum[]>(
			`album/${albumId}/track?take=${take ? take : ''}`
		);
	},

	async getManyIds(albumId: number, positionToExclude: number) {
		return await api.get<TracksIds>(
			`album/${albumId}/track/ids?positionToExclude=${positionToExclude ? positionToExclude : ''}`
		);
	},

	async updateTrackPosition(
		albumId: number,
		trackId: number,
		dto: UpdateTrackPositionDto
	) {
		return await api.patch<void>(
			`album/${albumId}/track/${trackId}/position`,
			dto
		);
	}
};
