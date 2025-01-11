'use client';

import { Trash2 } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { useMutation } from '@tanstack/react-query';
import { playlistService } from '@/services/playlist/playlist.service';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import { trackService } from '@/services/track/track.service';
import { albumService } from '@/services/album/album.service';
import { useAlbumTracksQuery } from '@/hooks/queries';
import { useTrackLocalStore } from '@/stores/track-local.store';
import { useQueueStore } from '@/stores/queue.store';
import { albumTrackService } from '@/services/album/album-track/album-track.service';

export function DeleteTrackButton({
	trackId,
	username
}: {
	trackId: number;
	username: string;
}) {
	const { toast } = useToast();
	const router = useRouter();

	const deleteMutation = useMutation({
		mutationFn: (trackId: number) => trackService.delete(trackId),
		onSuccess: () => {
			toast({ title: 'Track deleted' });
			router.push(`/${username}`);
		}
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button type='button' size='icon-lg' variant='outline'>
					<Trash2 className='size-5'></Trash2>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to delete this track?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete this
						track.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							deleteMutation.mutate(trackId);
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function DeleteAlbumTrackButton({
	trackToDeleteId,
	changeableId,
	albumId
}: {
	trackToDeleteId: number;
	changeableId: string;
	albumId: number;
}) {
	const { trackId } = useTrackLocalStore();
	const { type, queueId, setPrev, setNext } = useQueueStore();

	const { toast } = useToast();

	const albumTracksQuery = useAlbumTracksQuery(changeableId, albumId);

	const deleteMutation = useMutation({
		mutationFn: (trackToDeleteId: number) =>
			trackService.delete(trackToDeleteId),
		onSuccess: async () => {
			toast({ title: 'Track deleted' });

			const albumTracksQuery2 = await albumTracksQuery.refetch();
			const albumTracks = albumTracksQuery2.data?.data;

			if (!albumTracks) {
				return;
			}

			if (type === 'album' && queueId === albumId) {
				const relation = albumTracks.find(
					(relation) => relation.track.id === trackId
				);

				if (!relation) {
					return;
				}

				const tracksIds = await albumTrackService.getManyIds(
					albumId,
					relation.position
				);

				setPrev(tracksIds.data.prevIds);
				setNext(tracksIds.data.nextIds);
			}
		}
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button size='icon-xs' variant='clear'>
					<Trash2 className='size-4 translate-y-[0.5px]'></Trash2>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to delete this track?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete this
						track.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							deleteMutation.mutate(trackToDeleteId);
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function DeletePlaylistButton({
	playlistId,
	username
}: {
	playlistId: number;
	username: string;
}) {
	const { toast } = useToast();
	const router = useRouter();

	const deleteMutation = useMutation({
		mutationFn: (playlistId: number) => playlistService.delete(playlistId),
		onSuccess: () => {
			toast({ title: 'Playlist deleted' });
			router.push(`/${username}`);
		}
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button type='button' size='icon-lg' variant='outline'>
					<Trash2 className='size-5'></Trash2>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to delete this playlist?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete this
						playlist.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							deleteMutation.mutate(playlistId);
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function DeleteAlbumButton({
	albumId,
	username
}: {
	albumId: number;
	username: string;
}) {
	const { toast } = useToast();
	const router = useRouter();

	const deleteMutation = useMutation({
		mutationFn: (albumId: number) => albumService.delete(albumId),
		onSuccess: () => {
			toast({ title: 'Album deleted' });
			router.push(`/${username}`);
		}
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button type='button' size='icon-lg' variant='outline'>
					<Trash2 className='size-5'></Trash2>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to delete this album?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete this
						album.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							deleteMutation.mutate(albumId);
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
