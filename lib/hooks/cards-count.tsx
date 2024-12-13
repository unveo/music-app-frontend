import { useEffect } from 'react';
import { useCardsCountStore } from '@/stores/cards-count.store';

export default function useCardsCount() {
	const { setCardsCount } = useCardsCountStore();
	useEffect(() => {
		function handleResize() {
			setCardsCount(getTake(window.innerWidth));
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}); // [] нужно или нет?
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
