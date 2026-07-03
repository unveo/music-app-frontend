'use client';

import { AlbumCard } from '@/components/Cards';
import { LibraryGridShell } from '@/components/LibraryGridShell';
import { useLikedAlbumsQuery } from '@/hooks/queries';

export default function LikedAlbums() {
	const likedAlbumsQuery = useLikedAlbumsQuery();
	const likedAlbums = likedAlbumsQuery.data?.data;

	return (
		<LibraryGridShell
			isLoading={likedAlbumsQuery.isLoading}
			isError={likedAlbumsQuery.isError}
			isEmpty={!likedAlbums?.length}
			emptyMessage='No liked albums yet. Like albums to see them here.'
		>
			<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
				{likedAlbums?.map(({ album }) => (
					<AlbumCard album={album} key={album.id}></AlbumCard>
				))}
			</ul>
		</LibraryGridShell>
	);
}
