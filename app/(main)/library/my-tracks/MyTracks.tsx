'use client';

import { TrackCard } from '@/components/Cards';
import { LibraryGridShell } from '@/components/LibraryGridShell';
import { useCurrentUserQuery, useTracksQuery } from '@/hooks/queries';

export default function MyTracks() {
	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const myTracksQuery = useTracksQuery(currentUser?.id);
	const myTracks = myTracksQuery.data?.data;

	const isLoading = currentUserQuery.isLoading || myTracksQuery.isLoading;
	const isError = currentUserQuery.isError || myTracksQuery.isError;

	return (
		<LibraryGridShell
			isLoading={isLoading}
			isError={isError}
			isEmpty={!myTracks?.length}
			emptyMessage='No tracks uploaded yet. Upload your first track to see it here.'
		>
			<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
				{myTracks?.map((track) => (
					<TrackCard track={track} key={track.id}></TrackCard>
				))}
			</ul>
		</LibraryGridShell>
	);
}
