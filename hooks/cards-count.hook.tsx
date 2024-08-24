import { useEffect } from 'react';
import { getTake } from '../lib/utils';
import { useCardsCountStore } from '@/stores/cards-count.store';

export default function useCardsCount() {
	const { setCardsCount } = useCardsCountStore();
	useEffect(() => {
		function handleResize() {
			setCardsCount(getTake(window.innerWidth));
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);
}
