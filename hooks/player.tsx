'use client';

import { useListenTimeStore } from '@/stores/listen-time.store';
import { useSettingsStore } from '@/stores/settings.store';
import { useTrackLocalStore } from '@/stores/track-local.store';
import { useTrackStore } from '@/stores/track.store';
import { useCallback, useEffect } from 'react';
import { useCurrentTrackQuery } from './queries';
import { baseUrl, MS_TO_ADD_LISTEN } from '@/config';
import { trackService } from '@/services/track/track.service';
import { usePlayTrack } from './play-track';

export function usePlayer() {
	const {
		isPlaying,
		audio,
		audioReady,
		isSeeking,
		trackInfo,
		setTrackInfo,
		setAudio,
		setAudioReady,
		setProgress
	} = useTrackStore();
	const { currentTime, setCurrentTime } = useTrackLocalStore();
	const { setListenTime, setStartTime, listenTime, startTime } =
		useListenTimeStore();
	const { muted, volume } = useSettingsStore();

	const { onEnded } = usePlayTrack();

	const currentTrackQuery = useCurrentTrackQuery(
		useTrackLocalStore.getState().trackId!
	);
	const currentTrack = currentTrackQuery.data?.data;

	const updateTime = useCallback(() => {
		if (audio && !isSeeking) {
			setCurrentTime(audio.currentTime);
			setProgress(audio.currentTime / audio.duration);
		}
	}, [isSeeking, audio]);

	function onCanPlayThroughFirstLoad() {
		setAudioReady(true);
	}

	useEffect(() => {
		if (useTrackLocalStore.getState().trackId) {
			currentTrackQuery.refetch();
		}
	}, []);

	useEffect(() => {
		if (currentTrack) {
			const audio = new Audio(
				`${baseUrl.backend}/api/track/stream/${currentTrack.id}`
			);

			setAudio(audio);
			setTrackInfo(currentTrack);

			audio.addEventListener('canplaythrough', onCanPlayThroughFirstLoad);
			audio.addEventListener('ended', onEnded);

			return () => {
				audio.removeEventListener('canplaythrough', onCanPlayThroughFirstLoad);
				audio.removeEventListener('ended', onEnded);
			};
		}
	}, [currentTrack]);

	useEffect(() => {
		if (audio && audioReady) {
			if (currentTime > 0 && currentTime < audio.duration) {
				audio.currentTime = currentTime;
			}

			if (volume >= 0 && volume <= 1) {
				if (muted) {
					audio.volume = 0;
				} else {
					audio.volume = volume;
				}
			}
		}
	}, [audioReady]);

	useEffect(() => {
		if (audio && !isSeeking) {
			audio.addEventListener('timeupdate', updateTime);

			return () => {
				audio.removeEventListener('timeupdate', updateTime);
			};
		}
	}, [audio, updateTime]);

	useEffect(() => {
		if (trackInfo && typeof listenTime === 'number') {
			if (isPlaying && !startTime) {
				setStartTime(new Date().getTime());
			} else if (!isPlaying && startTime) {
				const newListenTime = new Date().getTime() - startTime + listenTime;

				if (newListenTime >= MS_TO_ADD_LISTEN) {
					trackService.addPlay(trackInfo.id);
					setListenTime(true);
				} else {
					setListenTime(newListenTime);
				}

				setStartTime(undefined);
			}
		}
	}, [isPlaying, trackInfo]);

	useEffect(() => {
		if (trackInfo && typeof listenTime === 'number' && isPlaying && startTime) {
			const intervalId = setInterval(() => {
				if (new Date().getTime() - startTime + listenTime >= MS_TO_ADD_LISTEN) {
					trackService.addPlay(trackInfo.id);
					setListenTime(true);
					setStartTime(undefined);
				}
			}, 1000);

			return () => clearInterval(intervalId);
		}
	}, [isPlaying, listenTime, startTime, trackInfo]);

	return { updateTime };
}
