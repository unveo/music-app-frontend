'use client';

import { X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from './ui/use-toast';
import { playlistTrackService } from '@/services/playlist/playlist-track/playlist-track.service';
import { Button } from './ui/button';
import { usePlaylistTracksQuery } from '@/hooks/queries';
import { useQueueStore } from '@/stores/queue.store';
import { useTrackLocalStore } from '@/stores/track-local.store';

export default function RemoveFromPlaylistButton({
	changeableId,
	playlistId,
	trackToRemoveId
}: {
	changeableId: string;
	playlistId: number;
	trackToRemoveId: number;
}) {
	const { trackId } = useTrackLocalStore();
	const { type, queueId, setPrev, setNext } = useQueueStore();

	const { toast } = useToast();

	const playlistTracksQuery = usePlaylistTracksQuery(changeableId, playlistId);

	const removeMutation = useMutation({
		mutationFn: ({
			playlistId,
			trackToRemoveId
		}: {
			playlistId: number;
			trackToRemoveId: number;
		}) => playlistTrackService.remove(playlistId, trackToRemoveId),
		onSuccess: async () => {
			toast({
				title: 'Track removed'
			});

			const playlistTracksQuery2 = await playlistTracksQuery.refetch();
			const playlistTracks = playlistTracksQuery2.data?.data;

			if (!playlistTracks) {
				return;
			}

			if (type === 'playlist' && queueId === playlistId) {
				const relation = playlistTracks.find(
					(relation) => relation.track.id === trackId
				);

				if (!relation) {
					return;
				}

				const tracksIds = await playlistTrackService.getManyIds(
					playlistId,
					relation.position
				);

				setPrev(tracksIds.data.prevIds);
				setNext(tracksIds.data.nextIds);
			}
		}
	});

	return (
		<Button
			onClick={() => removeMutation.mutate({ playlistId, trackToRemoveId })}
			variant='clear'
			size='icon-xs'
		>
			<X className='size-4 translate-y-[0.5px]' />
		</Button>
	);
}
