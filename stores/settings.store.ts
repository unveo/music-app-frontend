'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
	persist<{
		volume: number;
		muted: boolean;
		setVolume: (volume: number) => void;
		setMuted: (muted: boolean) => void;
	}>(
		(set) => ({
			volume: 0.5,
			muted: false,
			setVolume: (volume: number) => set(() => ({ volume })),
			setMuted: (muted: boolean) => set(() => ({ muted }))
		}),
		{ name: 'settings' }
	)
);
