'use client';

import { AlbumCardProfile } from '@/components/Cards';
import { useAlbumsQuery, useCurrentUserQuery } from '@/hooks/queries';

export default function MyAlbums() {
	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const myAlbumsQuery = useAlbumsQuery(currentUser?.id);
	const myAlbums = myAlbumsQuery.data?.data;

	return (
		<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
			{myAlbums?.map((album) => (
				<AlbumCardProfile album={album} key={album.id}></AlbumCardProfile>
			))}
		</ul>
	);
}
