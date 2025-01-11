import type { Track } from '@/services/track/track.types';

export interface UpdateTrackPositionDto {
	position: number;
}

export interface AddTrackDto {
	position?: number;
}

export interface TrackInPlaylist {
	position: number;
	track: Track;
	addedAt: string;
}

export interface PlaylistTrackRelation {
	position: number;
	trackId: number;
	playlistId: number;
	addedAt: string;
}
