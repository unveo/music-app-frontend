'use client';

import { createContext, useContext } from 'react';
import { useQueueStore } from '@/stores/queue.store';
import { useSettingsStore } from '@/stores/settings.store';
import { useTrackStore } from '@/stores/track.store';
import { useTrackLocalStore } from '@/stores/track-local.store';
import { usePlayTrackInternal } from './play-track-internal';

type PlayTrackContextValue = ReturnType<typeof usePlayTrackInternal>;

const PlayTrackContext = createContext<PlayTrackContextValue | null>(null);

export function PlayTrackProvider({ children }: { children: React.ReactNode }) {
	const value = usePlayTrackInternal();

	return (
		<PlayTrackContext.Provider value={value}>
			{children}
		</PlayTrackContext.Provider>
	);
}

export function usePlayTrack() {
	const context = useContext(PlayTrackContext);

	if (!context) {
		throw new Error('usePlayTrack must be used within PlayTrackProvider');
	}

	return context;
}

export function usePlayTrackState() {
	const isPlaying = useTrackStore((state) => state.isPlaying);
	const audioReady = useTrackStore((state) => state.audioReady);
	const trackId = useTrackLocalStore((state) => state.trackId);
	const queueId = useQueueStore((state) => state.queueId);
	const type = useQueueStore((state) => state.type);
	const shuffle = useSettingsStore((state) => state.shuffle);
	const repeat = useSettingsStore((state) => state.repeat);

	return {
		isPlaying,
		audioReady,
		trackId,
		queueId,
		type,
		shuffle,
		repeat
	};
}

export function usePlayTrackActions() {
	const {
		onClickUserTrack,
		onClickLikedTrack,
		onClickPlaylistTrack,
		onClickAlbumTrack,
		onClickUser,
		onClickPlaylist,
		onClickAlbum,
		onClickSkipBack,
		onClickPlay,
		onClickSkipForward,
		onClickShuffle,
		onClickRepeat
	} = usePlayTrack();

	return {
		onClickUserTrack,
		onClickLikedTrack,
		onClickPlaylistTrack,
		onClickAlbumTrack,
		onClickUser,
		onClickPlaylist,
		onClickAlbum,
		onClickSkipBack,
		onClickPlay,
		onClickSkipForward,
		onClickShuffle,
		onClickRepeat
	};
}
