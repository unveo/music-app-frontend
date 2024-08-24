import type { TrackWithUsername } from '@/services/track/track.types';

export interface ListeningHistoryTrack {
  track: TrackWithUsername;
}

export interface ListeningHistoryRelation {
  id: string;
  userId: number;
  trackId: number;
  playedAt: string;
}
