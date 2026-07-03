'use client';

import { PlaylistCard } from '@/components/Cards';
import { usePlaylistsWithSavedQuery } from '@/hooks/queries';

export default function SavedPlaylists() {
	const savedPlaylistsQuery = usePlaylistsWithSavedQuery();
	const savedPlaylists = savedPlaylistsQuery.data?.data;

	return (
		<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
			{savedPlaylists?.map((playlist) => (
				<PlaylistCard playlist={playlist} key={playlist.id}></PlaylistCard>
			))}
		</ul>
	);
}
