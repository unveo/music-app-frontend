'use client';

import NotFound from '@/components/NotFound';
import { useCurrentUserQuery, useTrackQuery } from '@/hooks/queries';
import AddToPlaylistMenu from '@/components/AddToPlaylistMenu';
import { LikeTrackButton } from '@/components/LikeButtons';
import { TrackTable } from '@/components/Tables';
import { TrackHero } from '@/components/Heroes';
import { PlayUserTrackButton } from '@/components/PlayButtons';

export default function Track({
	username,
	changeableId
}: {
	username: string;
	changeableId: string;
}) {
	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const trackQuery = useTrackQuery(username, changeableId);
	const track = trackQuery.data?.data;

	if (trackQuery.isLoading) {
		return null;
	}

	if (trackQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (!track || !currentUser) {
		return null;
	}

	return (
		<>
			<TrackHero username={username} changeableId={changeableId}></TrackHero>
			<div className='flex flex-col gap-4 px-8 py-6'>
				<div className='flex justify-between'>
					<div className='flex gap-2'>
						<PlayUserTrackButton
							track={track}
							variant='set'
						></PlayUserTrackButton>
						<LikeTrackButton
							username={username}
							changeableId={changeableId}
						></LikeTrackButton>
						<AddToPlaylistMenu trackToAddId={track.id}></AddToPlaylistMenu>
					</div>
					<div className='flex items-center justify-center text-sm'>
						Listens: {track.plays}
					</div>
				</div>
				<TrackTable
					changeableId={changeableId}
					username={username}
				></TrackTable>
			</div>
		</>
	);
}
