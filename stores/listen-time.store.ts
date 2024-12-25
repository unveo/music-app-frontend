'use client';

import { create } from 'zustand';

export const useListenTimeStore = create<{
	listenTime: number | true;
	startTime: number | undefined;
	setListenTime: (listenTime: number | true) => void;
	setStartTime: (startTime: number | undefined) => void;
}>((set) => ({
	listenTime: 0 as any,
	startTime: undefined,
	setListenTime: (listenTime: number | true) => set(() => ({ listenTime })),
	setStartTime: (startTime: number | undefined) => set(() => ({ startTime }))
}));
