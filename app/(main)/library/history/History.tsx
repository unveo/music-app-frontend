'use client';

import { ListeningHistoryCard } from '@/components/Cards';
import { LibraryGridShell } from '@/components/LibraryGridShell';
import { useHistoryQuery } from '@/hooks/queries';

export default function History() {
	const listeningHistoryQuery = useHistoryQuery();
	const listeningHistory = listeningHistoryQuery.data?.data;

	return (
		<LibraryGridShell
			isLoading={listeningHistoryQuery.isLoading}
			isError={listeningHistoryQuery.isError}
			isEmpty={!listeningHistory?.length}
			emptyMessage='No listening history yet. Play tracks to build your history.'
		>
			<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
				{listeningHistory?.map(({ track }) => (
					<ListeningHistoryCard
						key={track.id}
						track={track}
					></ListeningHistoryCard>
				))}
			</ul>
		</LibraryGridShell>
	);
}
