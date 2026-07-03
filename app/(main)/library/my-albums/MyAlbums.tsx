'use client';

import { AlbumCardProfile } from '@/components/Cards';
import { LibraryGridShell } from '@/components/LibraryGridShell';
import { useAlbumsQuery, useCurrentUserQuery } from '@/hooks/queries';

export default function MyAlbums() {
	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const myAlbumsQuery = useAlbumsQuery(currentUser?.id);
	const myAlbums = myAlbumsQuery.data?.data;

	const isLoading = currentUserQuery.isLoading || myAlbumsQuery.isLoading;
	const isError = currentUserQuery.isError || myAlbumsQuery.isError;

	return (
		<LibraryGridShell
			isLoading={isLoading}
			isError={isError}
			isEmpty={!myAlbums?.length}
			emptyMessage='No albums uploaded yet. Upload your first album to see it here.'
		>
			<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
				{myAlbums?.map((album) => (
					<AlbumCardProfile album={album} key={album.id}></AlbumCardProfile>
				))}
			</ul>
		</LibraryGridShell>
	);
}
