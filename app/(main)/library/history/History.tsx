'use client';

import { ListeningHistoryCard } from '@/components/Cards';
import { listeningHistoryService } from '@/services/user/listening-history/listening-history.service';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function History() {
	const listeningHistoryQuery = useQuery({
		queryKey: ['listening-history'],
		queryFn: () => listeningHistoryService.get()
	});
	const listeningHistory = listeningHistoryQuery.data?.data;

	return (
		<div className='flex flex-col gap-4 p-8'>
			<nav className='flex gap-6 text-2xl font-semibold text-muted-foreground'>
				<Link href='/library/tracks'>Liked Tracks</Link>
				<Link href='/library/playlists'>Playlists</Link>
				<Link href='/library/albums'>Albums</Link>
				<Link href='/library/history' className='text-primary'>
					History
				</Link>
			</nav>
			<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
				{listeningHistory &&
					listeningHistory.map(({ track }) => (
						<ListeningHistoryCard
							key={track.id}
							track={track}
						></ListeningHistoryCard>
					))}
			</ul>
		</div>
	);
}
