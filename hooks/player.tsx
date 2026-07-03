'use client';

import { useCallback, useEffect } from 'react';
import { AUDIO_ENDING, AUDIO_URL, MS_TO_ADD_LISTEN } from '@/config';
import { usePlayTrack } from '@/hooks/play-track';
import { useCurrentTrackQuery } from '@/hooks/queries';
import { trackService } from '@/services/track/track.service';
import { useListenTimeStore } from '@/stores/listen-time.store';
import { useSettingsStore } from '@/stores/settings.store';
import { useTrackStore } from '@/stores/track.store';
import { useTrackLocalStore } from '@/stores/track-local.store';

export function usePlayer() {
	const audio = useTrackStore((state) => state.audio);
	const audioReady = useTrackStore((state) => state.audioReady);
	const isSeeking = useTrackStore((state) => state.isSeeking);
	const isPlaying = useTrackStore((state) => state.isPlaying);
	const trackInfo = useTrackStore((state) => state.trackInfo);
	const setTrackInfo = useTrackStore((state) => state.setTrackInfo);
	const setAudio = useTrackStore((state) => state.setAudio);
	const setAudioReady = useTrackStore((state) => state.setAudioReady);
	const setProgress = useTrackStore((state) => state.setProgress);
	const setCurrentTime = useTrackLocalStore((state) => state.setCurrentTime);
	const trackId = useTrackLocalStore((state) => state.trackId);
	const listenTime = useListenTimeStore((state) => state.listenTime);
	const startTime = useListenTimeStore((state) => state.startTime);
	const setListenTime = useListenTimeStore((state) => state.setListenTime);
	const setStartTime = useListenTimeStore((state) => state.setStartTime);
	const muted = useSettingsStore((state) => state.muted);
	const volume = useSettingsStore((state) => state.volume);

	const { onEnded } = usePlayTrack();

	const currentTrackQuery = useCurrentTrackQuery(trackId ?? 0);
	const currentTrack = currentTrackQuery.data?.data;

	const updateTime = useCallback(() => {
		const currentAudio = useTrackStore.getState().audio;

		if (currentAudio && !useTrackStore.getState().isSeeking) {
			setCurrentTime(currentAudio.currentTime);
			setProgress(currentAudio.currentTime / currentAudio.duration);
		}
	}, [setCurrentTime, setProgress]);

	useEffect(() => {
		if (trackId) {
			currentTrackQuery.refetch();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!currentTrack || useTrackStore.getState().audio) {
			return;
		}

		const restoredAudio = new Audio(
			`${AUDIO_URL}/${currentTrack.audio}${AUDIO_ENDING}`
		);

		setAudio(restoredAudio);
		setTrackInfo(currentTrack);

		function onCanPlayThroughFirstLoad() {
			setAudioReady(true);
		}

		restoredAudio.addEventListener('canplaythrough', onCanPlayThroughFirstLoad);
		restoredAudio.addEventListener('ended', onEnded);

		return () => {
			restoredAudio.removeEventListener(
				'canplaythrough',
				onCanPlayThroughFirstLoad
			);
			restoredAudio.removeEventListener('ended', onEnded);
		};
	}, [currentTrack, onEnded, setAudio, setAudioReady, setTrackInfo]);

	useEffect(() => {
		if (audio && audioReady) {
			const savedTime = useTrackLocalStore.getState().currentTime;

			if (savedTime > 0 && savedTime < audio.duration) {
				audio.currentTime = savedTime;
			}
		}
		// Only restore seek position once when audio becomes ready.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [audioReady]);

	useEffect(() => {
		if (audio && audioReady && volume >= 0 && volume <= 1) {
			audio.volume = muted ? 0 : volume;
		}
	}, [audio, audioReady, muted, volume]);

	useEffect(() => {
		if (!audio || isSeeking) {
			return;
		}

		audio.addEventListener('timeupdate', updateTime);

		return () => {
			audio.removeEventListener('timeupdate', updateTime);
		};
	}, [audio, isSeeking, updateTime]);

	useEffect(() => {
		if (trackInfo && typeof listenTime === 'number') {
			if (isPlaying && !startTime) {
				setStartTime(Date.now());
			} else if (!isPlaying && startTime) {
				const newListenTime = Date.now() - startTime + listenTime;

				if (newListenTime >= MS_TO_ADD_LISTEN) {
					trackService.addPlay(trackInfo.id);
					setListenTime(true);
				} else {
					setListenTime(newListenTime);
				}

				setStartTime(undefined);
			}
		}
	}, [
		isPlaying,
		listenTime,
		setListenTime,
		setStartTime,
		startTime,
		trackInfo
	]);

	useEffect(() => {
		if (trackInfo && typeof listenTime === 'number' && isPlaying && startTime) {
			const intervalId = setInterval(() => {
				if (Date.now() - startTime + listenTime >= MS_TO_ADD_LISTEN) {
					trackService.addPlay(trackInfo.id);
					setListenTime(true);
					setStartTime(undefined);
				}
			}, 1000);

			return () => clearInterval(intervalId);
		}
	}, [
		isPlaying,
		listenTime,
		setListenTime,
		setStartTime,
		startTime,
		trackInfo
	]);

	return { updateTime };
}
