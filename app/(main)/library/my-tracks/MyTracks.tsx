'use client';

import { TrackCard } from '@/components/Cards';
import { useCurrentUserQuery, useTracksQuery } from '@/hooks/queries';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function MyTracks() {
	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const myTracksQuery = useTracksQuery(currentUser?.id);
	const myTracks = myTracksQuery.data?.data;

	return (
		<div className='library-div'>
			<ScrollArea className='w-full whitespace-nowrap'>
				<nav className='library-nav'>
					<Link href='/library/tracks'>Liked Tracks</Link>
					<Link href='/library/playlists'>Saved Playlists</Link>
					<Link href='/library/albums'>Liked Albums</Link>
					<Link href='/library/history'>History</Link>
					<Link href='/library/following'>Following</Link>
					<Link href='/library/my-tracks' className='text-primary'>
						My Tracks
					</Link>
					<Link href='/library/my-albums'>My Albums</Link>
				</nav>
				<ScrollBar orientation='horizontal' />
			</ScrollArea>
			<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
				{myTracks &&
					myTracks.map((track) => (
						<TrackCard track={track} key={track.id}></TrackCard>
					))}
			</ul>
		</div>
	);
}
