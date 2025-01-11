'use client';

import { LikedTrackCard } from '@/components/Cards';
import { useLikedTracksQuery } from '@/hooks/queries';
import Link from 'next/link';

export default function LikedTracks() {
	const likedTracksQuery = useLikedTracksQuery();
	const likedTracks = likedTracksQuery.data?.data;

	return (
		<div className='flex flex-col gap-4 p-8'>
			<nav className='flex gap-6 text-2xl font-semibold text-muted-foreground'>
				<Link href='/library/tracks' className='text-primary'>
					Liked Tracks
				</Link>
				<Link href='/library/playlists'>Playlists</Link>
				<Link href='/library/albums'>Albums</Link>
				<Link href='/library/history'>History</Link>
				<Link href='/library/following'>Following</Link>
			</nav>
			<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
				{likedTracks &&
					likedTracks.map(({ track }) => (
						<LikedTrackCard track={track} key={track.id}></LikedTrackCard>
					))}
			</ul>
		</div>
	);
}
