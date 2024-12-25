import { api } from '@/api/interceptors';
import type {
	AddTrackDto,
	AlbumTrackRelation,
	TrackInAlbum,
	UpdateTrackPositionDto
} from './album-track.types';
import { TracksIds } from '@/services/track/track.types';

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

	async addTrack(albumId: number, trackId: number, dto: AddTrackDto) {
		return await api.post<AlbumTrackRelation>(
			`album/${albumId}/track/${trackId}`,
			dto
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
	},

	async removeTrack(albumId: number, trackId: number) {
		return await api.delete<void>(`/album/${albumId}/track/${trackId}`);
	}
};
