'use client';

import NotFound from '@/components/NotFound';
import {
	useCurrentUserQuery,
	usePlaylistQuery,
	usePlaylistTracksQuery
} from '@/hooks/queries';
import { SavePlaylistButton } from '@/components/LikeButtons';
import { PlaylistTable } from '@/components/Tables';
import { PlaylistHero } from '@/components/Heroes';
import { PlayPlaylistButton } from '@/components/PlayButtons';

export default function Playlist({
	username,
	changeableId
}: {
	username: string;
	changeableId: string;
}) {
	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const playlistQuery = usePlaylistQuery(username, changeableId);
	const playlist = playlistQuery.data?.data;

	const playlistTracksQuery = usePlaylistTracksQuery(
		changeableId,
		playlist?.id
	);
	const playlistTracks = playlistTracksQuery.data?.data;

	if (playlistQuery.isLoading) {
		return null;
	}

	if (playlistQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (!playlist || !currentUser) {
		return null;
	}

	return (
		<>
			<PlaylistHero
				changeableId={changeableId}
				username={username}
			></PlaylistHero>
			<div className='flex flex-col gap-4 px-8 py-6'>
				<div className='flex gap-2'>
					{playlistTracks?.length ? (
						<PlayPlaylistButton
							track={playlistTracks[0].track}
							playlistId={playlist.id}
							variant='set'
						></PlayPlaylistButton>
					) : null}
					<SavePlaylistButton
						changeableId={changeableId}
						username={username}
					></SavePlaylistButton>
				</div>
				<PlaylistTable
					changeableId={changeableId}
					username={username}
				></PlaylistTable>
			</div>
		</>
	);
}
