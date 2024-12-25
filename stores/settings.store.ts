'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
	persist<{
		volume: number;
		muted: boolean;
		repeat: 'full' | 'one' | false;
		shuffle: boolean;
		setVolume: (volume: number) => void;
		setMuted: (muted: boolean) => void;
		setRepeat: (repeat: 'full' | 'one' | false) => void;
		setShuffle: (shuffle: boolean) => void;
	}>(
		(set) => ({
			volume: 0.5,
			muted: false,
			repeat: false,
			shuffle: false,
			setVolume: (volume: number) => set(() => ({ volume })),
			setMuted: (muted: boolean) => set(() => ({ muted })),
			setRepeat: (repeat: 'full' | 'one' | false) => set(() => ({ repeat })),
			setShuffle: (shuffle: boolean) => set(() => ({ shuffle }))
		}),
		{ name: 'settings' }
	)
);
