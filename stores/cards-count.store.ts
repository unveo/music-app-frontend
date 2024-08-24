import { create } from 'zustand';

export const useCardsCountStore = create<{
	cardsCount: number;
	setCardsCount: (cardsCount: number) => void;
}>((set) => ({
	cardsCount: 6,
	setCardsCount: (cardsCount: number) => set(() => ({ cardsCount }))
}));
