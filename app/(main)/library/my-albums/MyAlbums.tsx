'use client';

import { AlbumCard } from '@/components/Cards';
import { useCurrentUserQuery, useAlbumsQuery } from '@/hooks/queries';
import Link from 'next/link';

export default function MyAlbums() {
	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const myAlbumsQuery = useAlbumsQuery(currentUser?.id);
	const myAlbums = myAlbumsQuery.data?.data;

	return (
		<div className='flex flex-col gap-4 p-8'>
			<nav className='flex gap-6 text-2xl font-semibold text-muted-foreground'>
				<Link href='/library/tracks'>Liked Tracks</Link>
				<Link href='/library/playlists'>Saved Playlists</Link>
				<Link href='/library/albums'>Liked Albums</Link>
				<Link href='/library/history'>History</Link>
				<Link href='/library/following'>Following</Link>
				<Link href='/library/my-tracks'>My Tracks</Link>
				<Link href='/library/my-albums' className='text-primary'>
					My Albums
				</Link>
			</nav>
			<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
				{myAlbums &&
					myAlbums.map((album) => (
						<AlbumCard album={album} key={album.id}></AlbumCard>
					))}
			</ul>
		</div>
	);
}
