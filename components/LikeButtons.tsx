'use client';

import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useTrackStore } from '@/stores/track.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likedTrackService } from '@/services/user/liked-track/liked-track.service';
import {
	useCurrentUserQuery,
	usePlaylistQuery,
	useTrackQuery
} from '@/hooks/queries';
import { savedPlaylistService } from '@/services/user/saved-playlist/saved-playlist.service';

export function LikeTrackButton({
	username,
	changeableId,
	inTable
}: {
	username: string;
	changeableId: string;
	inTable?: boolean;
}) {
	const { trackInfo, setTrackInfo } = useTrackStore();

	const trackQuery = useTrackQuery(username, changeableId);
	const track = trackQuery.data?.data;

	const queryClient = useQueryClient();

	const addToLikedMutation = useMutation({
		mutationFn: (trackId: number) => likedTrackService.add(trackId),
		onSuccess: () => {
			if (trackInfo && track && trackInfo.id === track.id) {
				setTrackInfo({
					...trackInfo,
					likes: [{ addedAt: Date.now().toString() }]
				});
			}

			queryClient.setQueryData(['track', changeableId], {
				data: { ...track, likes: [{ addedAt: Date.now().toString() }] }
			});
		}
	});

	const removeFromLikedMutation = useMutation({
		mutationFn: (trackId: number) => likedTrackService.remove(trackId),
		onSuccess: () => {
			if (trackInfo && track && trackInfo.id === track.id) {
				setTrackInfo({
					...trackInfo,
					likes: []
				});
			}

			queryClient.setQueryData(['track', changeableId], {
				data: { ...track, likes: [] }
			});
		}
	});

	if (!track) {
		return null;
	}

	return (
		<Button
			variant={inTable ? 'ghost' : 'outline'}
			size={inTable ? 'icon-xs' : 'icon-lg'}
			onClick={() => {
				track.likes.length
					? removeFromLikedMutation.mutate(track.id)
					: addToLikedMutation.mutate(track.id);
			}}
		>
			{track.likes.length ? (
				<Heart
					className={
						inTable
							? 'size-4 translate-y-[0.5px] fill-foreground'
							: 'size-5 fill-foreground'
					}
				></Heart>
			) : (
				<Heart
					className={inTable ? 'size-4 translate-y-[0.5px]' : 'size-5'}
				></Heart>
			)}
		</Button>
	);
}

export function SavePlaylistButton({
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

	const queryClient = useQueryClient();

	const addToSavedMutation = useMutation({
		mutationFn: (playlistId: number) => savedPlaylistService.save(playlistId),
		onSuccess: () => {
			queryClient.setQueryData(['playlist', changeableId], {
				data: {
					...playlist,
					savedByUsers: [{ addedAt: Date.now().toString() }]
				}
			});
		}
	});

	const removeFromSavedMutation = useMutation({
		mutationFn: (playlistId: number) => savedPlaylistService.remove(playlistId),
		onSuccess: () => {
			queryClient.setQueryData(['playlist', changeableId], {
				data: { ...playlist, savedByUsers: [] }
			});
		}
	});

	if (!playlist || playlist.userId === currentUser?.id) {
		return null;
	}

	return (
		<Button
			variant='outline'
			size='icon-lg'
			onClick={() => {
				playlist.savedByUsers.length
					? removeFromSavedMutation.mutate(playlist.id)
					: addToSavedMutation.mutate(playlist.id);
			}}
		>
			{playlist.savedByUsers.length ? (
				<Heart className='size-5 fill-foreground'></Heart>
			) : (
				<Heart className='size-5'></Heart>
			)}
		</Button>
	);
}
