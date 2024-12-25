'use client';

import { PlaylistCard } from '@/components/Cards';
import { List, ListSkeleton } from '@/components/Lists';
import NotFound from '@/components/NotFound';
import { playlistService } from '@/services/playlist/playlist.service';
import { userService } from '@/services/user/user.service';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function Playlists({ username }: { username: string }) {
	const userQuery = useQuery({
		queryKey: ['user', username],
		queryFn: () => userService.getByName(username),
		retry: false
	});
	const user = userQuery.data?.data;
	const userId = user?.id;
	const playlistsQuery = useQuery({
		queryKey: ['playlists', userId],
		queryFn: () => playlistService.getMany(userId),
		enabled: !!userId
	});
	const playlists = playlistsQuery.data?.data;

	if (userQuery.isLoading) {
		return <></>;
	}

	if (userQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (playlistsQuery.isLoading) {
		return <></>;
	}

	if (playlists) {
		if (playlists.length) {
			return (
				<List username={username} name='playlists'>
					{playlists.map((playlist) => (
						<PlaylistCard key={playlist.id} playlist={playlist}></PlaylistCard>
					))}
				</List>
			);
		} else {
			return (
				<div className='flex w-full max-w-[80rem] flex-grow items-center justify-center gap-5 p-8 text-5xl'>
					<Link href={`/${username}`} className='font-semibold'>
						{`${username}`}
					</Link>
					<span>{`doesn't have any playlists`}</span>
				</div>
			);
		}
	}
}
