'use client';

import { useQuery } from '@tanstack/react-query';
import { ListMusic } from 'lucide-react';
import Link from 'next/link';
import { trackService } from '@/services/track/track.service';
import { useQueueStore } from '@/stores/queue.store';
import { useTrackStore } from '@/stores/track.store';
import { useTrackLocalStore } from '@/stores/track-local.store';
import { Button } from './ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from './ui/dropdown-menu';

function useQueueTracksQuery(trackIds: number[]) {
	return useQuery({
		queryKey: ['queue-tracks', trackIds.join(',')],
		queryFn: async () => {
			const tracks = await Promise.all(
				trackIds.map((id) => trackService.getOneById(id))
			);
			return tracks.map(({ data }) => data);
		},
		enabled: trackIds.length > 0
	});
}

export function QueuePanel() {
	const trackId = useTrackLocalStore((state) => state.trackId);
	const trackInfo = useTrackStore((state) => state.trackInfo);
	const prev = useQueueStore((state) => state.prev);
	const next = useQueueStore((state) => state.next);
	const type = useQueueStore((state) => state.type);

	const upcomingIds = next.slice(0, 10);
	const queueTracksQuery = useQueueTracksQuery(upcomingIds);
	const upcomingTracks = queueTracksQuery.data;

	const queueLabel =
		type === 'playlist'
			? 'Playlist queue'
			: type === 'album'
				? 'Album queue'
				: type === 'liked'
					? 'Liked tracks queue'
					: 'Artist queue';

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button variant='clear' size='icon' aria-label='Open queue'>
					<ListMusic className='size-5' aria-hidden='true' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-72'>
				<DropdownMenuLabel>{queueLabel}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{trackInfo ? (
					<div className='px-2 py-1.5 text-sm'>
						<p className='font-medium'>Now playing</p>
						<p className='truncate text-muted-foreground'>{trackInfo.title}</p>
					</div>
				) : null}
				<DropdownMenuSeparator />
				<div className='max-h-64 overflow-y-auto overscroll-contain'>
					{upcomingTracks?.length ? (
						upcomingTracks.map((track) => (
							<div key={track.id} className='px-2 py-1.5 text-sm'>
								<Link
									href={`/${track.username}/${track.changeableId}`}
									className='block truncate hover:text-primary'
								>
									{track.title}
								</Link>
								<p className='truncate text-xs text-muted-foreground'>
									{track.username}
								</p>
							</div>
						))
					) : (
						<p className='px-2 py-4 text-center text-sm text-muted-foreground'>
							No upcoming tracks
						</p>
					)}
				</div>
				<DropdownMenuSeparator />
				<p className='px-2 py-1 text-xs text-muted-foreground'>
					{prev.length} played · {next.length} remaining
					{trackId ? ` · current #${trackId}` : ''}
				</p>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
