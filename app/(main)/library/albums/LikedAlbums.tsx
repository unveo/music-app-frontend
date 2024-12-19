'use client';

import { AlbumCard } from '@/components/Cards';
import { likedAlbumService } from '@/services/user/liked-album/liked-album.service';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function LikedAlbums() {
	const likedAlbumsQuery = useQuery({
		queryKey: ['liked-albums'],
		queryFn: () => likedAlbumService.getMany()
	});
	const likedAlbums = likedAlbumsQuery.data?.data;

	return (
		<div className='flex flex-col gap-4 p-8'>
			<nav className='flex gap-6 text-2xl font-semibold text-muted-foreground'>
				<Link href='/library/tracks'>Liked Tracks</Link>
				<Link href='/library/playlists'>Playlists</Link>
				<Link href='/library/albums' className='text-primary'>
					Albums
				</Link>
				<Link href='/library/history'>History</Link>
			</nav>
			<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
				{likedAlbums &&
					likedAlbums.map(({ album }) => (
						<AlbumCard album={album} key={album.id}></AlbumCard>
					))}
			</ul>
		</div>
	);
}
