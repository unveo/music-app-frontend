'use client';

import NotFound from '@/components/NotFound';
import {
	useCurrentUserQuery,
	useAlbumQuery,
	useAlbumTracksQuery
} from '@/hooks/queries';
import { LikeAlbumButton } from '@/components/LikeButtons';
import { AlbumSortableTable, AlbumTable } from '@/components/Tables';
import { AlbumHero } from '@/components/Heroes';
import { PlayAlbumButton } from '@/components/PlayButtons';

export default function Album({
	username,
	changeableId
}: {
	username: string;
	changeableId: string;
}) {
	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const albumQuery = useAlbumQuery(username, changeableId);
	const album = albumQuery.data?.data;

	const albumTracksQuery = useAlbumTracksQuery(changeableId, album?.id);
	const albumTracks = albumTracksQuery.data?.data;

	if (albumQuery.isLoading) {
		return null;
	}

	if (albumQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (!album || !currentUser) {
		return null;
	}

	return (
		<>
			<AlbumHero changeableId={changeableId} username={username}></AlbumHero>
			<div className='flex flex-col gap-4 px-8 py-6'>
				<div className='flex gap-2'>
					{albumTracks?.length ? (
						<PlayAlbumButton
							track={albumTracks[0].track}
							albumId={album.id}
							variant='set'
						></PlayAlbumButton>
					) : null}
					<LikeAlbumButton
						changeableId={changeableId}
						username={username}
					></LikeAlbumButton>
				</div>
				{album.userId === currentUser.id ? (
					<AlbumSortableTable
						changeableId={changeableId}
						username={username}
					></AlbumSortableTable>
				) : (
					<AlbumTable
						changeableId={changeableId}
						username={username}
					></AlbumTable>
				)}
			</div>
		</>
	);
}
