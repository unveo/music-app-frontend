'use client';

import { ListeningHistoryCard } from '@/components/Cards';
import { useHistoryQuery } from '@/hooks/queries';

export default function History() {
	const listeningHistoryQuery = useHistoryQuery();
	const listeningHistory = listeningHistoryQuery.data?.data;

	return (
		<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
			{listeningHistory?.map(({ track }) => (
				<ListeningHistoryCard
					key={track.id}
					track={track}
				></ListeningHistoryCard>
			))}
		</ul>
	);
}
