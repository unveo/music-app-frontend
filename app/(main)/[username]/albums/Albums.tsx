'use client';

import { AlbumCard } from '@/components/Cards';
import { List } from '@/components/Lists';
import NotFound from '@/components/NotFound';
import { useAlbumsQuery, useUserQuery } from '@/hooks/queries';
import Link from 'next/link';

export default function Albums({ username }: { username: string }) {
	const userQuery = useUserQuery(username);
	const user = userQuery.data?.data;

	const albumsQuery = useAlbumsQuery(user?.id);
	const albums = albumsQuery.data?.data;

	if (userQuery.isLoading) {
		return null;
	}

	if (userQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (albumsQuery.isLoading) {
		return null;
	}

	if (albums) {
		if (albums.length) {
			return (
				<List username={username} name='albums'>
					{albums.map((album) => (
						<AlbumCard key={album.id} album={album}></AlbumCard>
					))}
				</List>
			);
		} else {
			return (
				<div className='flex w-full max-w-[80rem] flex-grow items-center justify-center gap-5 p-8 text-5xl'>
					<Link href={`/${username}`} className='font-semibold'>
						{`${username}`}
					</Link>
					<span>{`doesn't have any albums`}</span>
				</div>
			);
		}
	}
}
