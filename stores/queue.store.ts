'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useQueueStore = create(
	persist<{
		prev: number[];
		next: number[];
		all: number[];
		type: 'playlist' | 'album' | 'user' | 'liked';
		queueId: number;
		setPrev: (next: number[]) => void;
		setNext: (next: number[]) => void;
		setAll: (all: number[]) => void;
		setType: (type: 'playlist' | 'album' | 'user' | 'liked') => void;
		setQueueId: (queueId: number) => void;
	}>(
		(set) => ({
			prev: [],
			next: [],
			all: [],
			type: 'user',
			queueId: 0,
			setPrev: (prev: number[]) => set(() => ({ prev })),
			setNext: (next: number[]) => set(() => ({ next })),
			setAll: (all: number[]) => set(() => ({ all })),
			setType: (type: 'playlist' | 'album' | 'user' | 'liked') =>
				set(() => ({ type })),
			setQueueId: (queueId: number) => set(() => ({ queueId }))
		}),
		{ name: 'queue' }
	)
);
