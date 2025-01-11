'use client';

import { PlaylistCard } from '@/components/Cards';
import { List } from '@/components/Lists';
import NotFound from '@/components/NotFound';
import { usePlaylistsQuery, useUserQuery } from '@/hooks/queries';
import Link from 'next/link';

export default function Playlists({ username }: { username: string }) {
	const userQuery = useUserQuery(username);
	const user = userQuery.data?.data;

	const playlistsQuery = usePlaylistsQuery(user?.id);
	const playlists = playlistsQuery.data?.data;

	if (userQuery.isLoading) {
		return null;
	}

	if (userQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (playlistsQuery.isLoading) {
		return null;
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
