import type { Track } from '@/services/track/track.types';

export interface ListeningHistoryTrack {
	track: Track;
}

export interface ListeningHistoryRelation {
	id: string;
	userId: number;
	trackId: number;
	playedAt: string;
}
