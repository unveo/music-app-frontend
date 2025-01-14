'use client';

import { LikedTrackCard } from '@/components/Cards';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useLikedTracksQuery } from '@/hooks/queries';
import Link from 'next/link';

export default function LikedTracks() {
	const likedTracksQuery = useLikedTracksQuery();
	const likedTracks = likedTracksQuery.data?.data;

	return (
		<div className='library-div'>
			<ScrollArea className='w-full whitespace-nowrap'>
				<nav className='library-nav'>
					<Link href='/library/tracks' className='text-primary'>
						Liked Tracks
					</Link>
					<Link href='/library/playlists'>Saved Playlists</Link>
					<Link href='/library/albums'>Liked Albums</Link>
					<Link href='/library/history'>History</Link>
					<Link href='/library/following'>Following</Link>
					<Link href='/library/my-tracks'>My Tracks</Link>
					<Link href='/library/my-albums'>My Albums</Link>
				</nav>
				<ScrollBar orientation='horizontal' />
			</ScrollArea>
			<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
				{likedTracks &&
					likedTracks.map(({ track }) => (
						<LikedTrackCard track={track} key={track.id}></LikedTrackCard>
					))}
			</ul>
		</div>
	);
}
