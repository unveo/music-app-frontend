'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useQueueStore = create(
	persist<{
		prev: number[];
		next: number[];
		all: number[];
		setPrev: (next: number[]) => void;
		setNext: (next: number[]) => void;
		setAll: (all: number[]) => void;
	}>(
		(set) => ({
			prev: [],
			next: [],
			all: [],
			setPrev: (prev: number[]) => set(() => ({ prev })),
			setNext: (next: number[]) => set(() => ({ next })),
			setAll: (all: number[]) => set(() => ({ all }))
		}),
		{ name: 'queue' }
	)
);
