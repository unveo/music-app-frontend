'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useListeningHistoryStore = create(
	persist<{
		listeningHistory: number[];
		setListeningHistory: (listeningHistory: number[]) => void;
	}>(
		(set) => ({
			listeningHistory: [],
			setListeningHistory: (listeningHistory: number[]) =>
				set(() => ({ listeningHistory }))
		}),
		{ name: 'listeningHistory' }
	)
);
