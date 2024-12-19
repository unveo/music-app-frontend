'use client';

import { PlaylistCard } from '@/components/Cards';
import { savedPlaylistService } from '@/services/user/saved-playlist/saved-playlist.service';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function SavedPlaylists() {
	const savedPlaylistsQuery = useQuery({
		queryKey: ['saved-playlists'],
		queryFn: () => savedPlaylistService.getMany()
	});
	const savedPlaylists = savedPlaylistsQuery.data?.data;

	return (
		<div className='flex flex-col gap-4 p-8'>
			<nav className='flex gap-6 text-2xl font-semibold text-muted-foreground'>
				<Link href='/library/tracks'>Liked Tracks</Link>
				<Link href='/library/playlists' className='text-primary'>
					Playlists
				</Link>
				<Link href='/library/albums'>Albums</Link>
				<Link href='/library/history'>History</Link>
			</nav>
			<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
				{savedPlaylists &&
					savedPlaylists.map(({ playlist }) => (
						<PlaylistCard playlist={playlist} key={playlist.id}></PlaylistCard>
					))}
			</ul>
		</div>
	);
}
