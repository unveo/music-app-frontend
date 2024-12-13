'use client';

import { AlbumCard } from '@/components/Cards';
import { List, ListSkeleton } from '@/components/Lists';
import NotFound from '@/components/NotFound';
import { albumService } from '@/services/album/album.service';
import { userService } from '@/services/user/user.service';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function Albums({ username }: { username: string }) {
	const userQuery = useQuery({
		queryKey: ['user', username],
		queryFn: () => userService.getByName(username),
		retry: false
	});
	const user = userQuery.data?.data;
	const userId = user?.id;
	const albumsQuery = useQuery({
		queryKey: ['albums', userId],
		queryFn: () => albumService.getMany(userId),
		enabled: !!userId
	});
	const albums = albumsQuery.data?.data;

	if (userQuery.isLoading) {
		return <></>;
	}

	if (userQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (albumsQuery.isLoading) {
		return <ListSkeleton></ListSkeleton>;
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
