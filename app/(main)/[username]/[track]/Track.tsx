'use client';

import AddToPlaylistMenu from '@/components/AddToPlaylistMenu';
import { TrackHero } from '@/components/Heroes';
import { LikeTrackButton } from '@/components/LikeButtons';
import NotFound from '@/components/NotFound';
import { PlayUserTrackButton } from '@/components/PlayButtons';
import { TrackTable } from '@/components/Tables';
import { useCurrentUserQuery, useTrackQuery } from '@/hooks/queries';

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
				<TrackTable
					changeableId={changeableId}
					username={username}
				></TrackTable>
			</div>
		</>
	);
}
