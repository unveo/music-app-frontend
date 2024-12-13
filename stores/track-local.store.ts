'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTrackLocalStore = create(
	persist<{
		trackId: number | null;
		currentTime: number;
		setTrackId: (trackId: number | null) => void;
		setCurrentTime: (currentTime: number) => void;
	}>(
		(set) => ({
			trackId: null,
			currentTime: 0,
			setTrackId: (trackId: number | null) => set(() => ({ trackId })),
			setCurrentTime: (currentTime: number) => set(() => ({ currentTime }))
		}),
		{ name: 'track' }
	)
);
