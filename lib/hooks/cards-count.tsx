'use client';

import { useEffect } from 'react';
import { useCardsCountStore } from '@/stores/cards-count.store';

export default function useCardsCount() {
	const { setCardsCount } = useCardsCountStore();
	useEffect(() => {
		if (typeof window === 'undefined') return;
		function handleResize() {
			setCardsCount(getTake(window.innerWidth));
		}
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [setCardsCount]);
}

function getTake(innerWidth: number) {
	if (innerWidth >= 1024) {
		return 6;
	} else if (innerWidth >= 768) {
		return 5;
	} else if (innerWidth >= 640) {
		return 4;
	} else {
		return 3;
	}
}
