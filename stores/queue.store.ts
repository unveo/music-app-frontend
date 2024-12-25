'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useQueueStore = create(
	persist<{
		prev: number[];
		next: number[];
		setPrev: (next: number[]) => void;
		setNext: (next: number[]) => void;
	}>(
		(set) => ({
			prev: [],
			next: [],
			setPrev: (prev: number[]) => set(() => ({ prev })),
			setNext: (next: number[]) => set(() => ({ next }))
		}),
		{ name: 'queue' }
	)
);
