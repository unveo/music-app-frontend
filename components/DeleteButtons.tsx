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
