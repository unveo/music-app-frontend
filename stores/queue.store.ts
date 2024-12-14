'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useQueueStore = create(
	persist<{
		queue: number[];
		setQueue: (queue: number[]) => void;
	}>(
		(set) => ({
			queue: [],
			setQueue: (queue: number[]) => set(() => ({ queue }))
		}),
		{ name: 'queue' }
	)
);
// type: 'album' | 'playlist' | 'liked' | null;
// id: number | null;
// setType: (type: 'album' | 'playlist' | 'liked') => void;
// setId: (id: number) => void;

// type: null,
// id: null,
// setType: (type: 'album' | 'playlist' | 'liked') => set(() => ({ type })),
// setId: (id: number) => set(() => ({ id }))
