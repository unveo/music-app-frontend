'use client';

import { useEffect } from 'react';
import { IMAGES_URL, SMALL_IMAGE_ENDING } from '@/config';
import { usePlayTrackActions, usePlayTrackState } from '@/hooks/play-track';
import { useTrackStore } from '@/stores/track.store';

export function useMediaSession() {
	const trackInfo = useTrackStore((state) => state.trackInfo);
	const { onClickPlay, onClickSkipBack, onClickSkipForward } =
		usePlayTrackActions();
	const { isPlaying } = usePlayTrackState();

	useEffect(() => {
		if (!trackInfo || !('mediaSession' in navigator)) {
			return;
		}

		navigator.mediaSession.metadata = new MediaMetadata({
			title: trackInfo.title,
			artist: trackInfo.username,
			artwork: [
				{
					src: `${IMAGES_URL}/${trackInfo.image}${SMALL_IMAGE_ENDING}`,
					sizes: '96x96',
					type: 'image/jpeg'
				}
			]
		});

		navigator.mediaSession.setActionHandler('play', onClickPlay);
		navigator.mediaSession.setActionHandler('pause', onClickPlay);
		navigator.mediaSession.setActionHandler('previoustrack', onClickSkipBack);
		navigator.mediaSession.setActionHandler('nexttrack', onClickSkipForward);

		return () => {
			navigator.mediaSession.setActionHandler('play', null);
			navigator.mediaSession.setActionHandler('pause', null);
			navigator.mediaSession.setActionHandler('previoustrack', null);
			navigator.mediaSession.setActionHandler('nexttrack', null);
		};
	}, [onClickPlay, onClickSkipBack, onClickSkipForward, trackInfo]);

	useEffect(() => {
		if ('mediaSession' in navigator) {
			navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
		}
	}, [isPlaying]);
}
