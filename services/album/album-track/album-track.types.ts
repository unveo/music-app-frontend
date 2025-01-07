import type { Track } from '@/services/track/track.types';

export interface UpdateTrackPositionDto {
	position: number;
}

export interface TrackInAlbum {
	position: number;
	track: Track;
	addedAt: string;
}
