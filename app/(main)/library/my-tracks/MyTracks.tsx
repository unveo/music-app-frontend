'use client';

import { TrackCard } from '@/components/Cards';
import { useCurrentUserQuery, useTracksQuery } from '@/hooks/queries';

export default function MyTracks() {
	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const myTracksQuery = useTracksQuery(currentUser?.id);
	const myTracks = myTracksQuery.data?.data;

	return (
		<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
			{myTracks?.map((track) => (
				<TrackCard track={track} key={track.id}></TrackCard>
			))}
		</ul>
	);
}
