'use client';

import type { TrackWithUsername } from '@/services/track/track.types';
import { create } from 'zustand';

export const useTrackStore = create<{
	trackInfo: TrackWithUsername | null;
	isPlaying: boolean;
	audio: HTMLAudioElement | null;
	audioReady: boolean;
	progress: number;
	setTrackInfo: (trackInfo: TrackWithUsername | null) => void;
	setIsPlaying: (isPlaying: boolean) => void;
	setAudio: (audio: HTMLAudioElement | null) => void;
	setAudioReady: (audioReady: boolean) => void;
	setProgress: (progress: number) => void;
}>((set) => ({
	trackInfo: null,
	isPlaying: false,
	audio: null,
	audioReady: false,
	progress: 0,
	setTrackInfo: (trackInfo: TrackWithUsername | null) =>
		set(() => ({ trackInfo })),
	setIsPlaying: (isPlaying: boolean) => set(() => ({ isPlaying })),
	setAudio: (audio: HTMLAudioElement | null) => set(() => ({ audio })),
	setAudioReady: (audioReady: boolean) => set(() => ({ audioReady })),
	setProgress: (progress: number) => set(() => ({ progress }))
}));
