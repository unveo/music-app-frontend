'use client';

import { LikedTrackCard } from '@/components/Cards';
import { useLikedTracksQuery } from '@/hooks/queries';

export default function LikedTracks() {
	const likedTracksQuery = useLikedTracksQuery();
	const likedTracks = likedTracksQuery.data?.data;

	return (
		<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
			{likedTracks?.map(({ track }) => (
				<LikedTrackCard track={track} key={track.id}></LikedTrackCard>
			))}
		</ul>
	);
}
