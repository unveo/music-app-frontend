'use client';

import { Plus } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from './ui/dropdown-menu';
import { useCurrentUserQuery, usePlaylistsQuery } from '@/hooks/queries';
import { useMutation } from '@tanstack/react-query';
import { useToast } from './ui/use-toast';
import { playlistTrackService } from '@/services/playlist/playlist-track/playlist-track.service';
import { useQueueStore } from '@/stores/queue.store';

export default function AddToPlaylistMenu({
	trackToAddId,
	inTable
}: {
	trackToAddId: number;
	inTable?: boolean;
}) {
	const { type, queueId, setNext } = useQueueStore();

	const { toast } = useToast();

	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const playlistsQuery = usePlaylistsQuery(currentUser?.id);
	const playlists = playlistsQuery.data?.data;

	const addMutation = useMutation({
		mutationFn: ({
			playlistId,
			trackToAddId
		}: {
			playlistId: number;
			trackToAddId: number;
		}) => playlistTrackService.add(playlistId, trackToAddId),
		onSuccess: (response) => {
			toast({
				title: 'Track saved'
			});

			if (type === 'playlist' && queueId === response.data.playlistId) {
				setNext([...useQueueStore.getState().next, trackToAddId]);
			}
		}
	});

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger
				className={`${inTable ? 'size-4' : 'flex size-12 items-center justify-center rounded-full border border-input bg-background'} hover:bg-accent hover:text-accent-foreground`}
			>
				<Plus
					className={inTable ? 'size-4 translate-y-[0.5px]' : 'size-5'}
				></Plus>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				side={inTable ? 'top' : 'right'}
				align={inTable ? 'end' : 'start'}
				className='max-h-48 max-w-40 overflow-y-scroll sm:max-w-60'
			>
				<DropdownMenuLabel>Add to playlist</DropdownMenuLabel>
				<DropdownMenuSeparator></DropdownMenuSeparator>
				{playlists?.length ? (
					playlists?.map((playlist) => (
						<DropdownMenuItem key={playlist.id}>
							<button
								onClick={() => {
									addMutation.mutate({
										playlistId: playlist.id,
										trackToAddId
									});
								}}
								className='h-full w-full truncate px-2 py-1.5 text-start'
							>
								{playlist.title}
							</button>
						</DropdownMenuItem>
					))
				) : (
					<div className='p-2'>You don&apos;t have playlists</div>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
