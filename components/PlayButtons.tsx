'use client';

import type { Track } from '@/services/track/track.types';
import { Button } from './ui/button';
import { Pause, Play } from 'lucide-react';
import { usePlayTrack } from '@/hooks/play-track';

export function PlayUserTrackButton({
	track,
	variant
}: {
	track?: Track;
	variant: 'card' | 'table' | 'set';
}) {
	const { isPlaying, trackId, type, queueId, onClickUserTrack } =
		usePlayTrack();

	if (!track) {
		return null;
	}

	let classes = '';

	if (variant === 'table') {
		classes = `${
			isPlaying &&
			trackId === track.id &&
			type === 'user' &&
			queueId === track.userId
				? 'opacity-100'
				: 'opacity-0'
		} absolute transition-opacity group-hover:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`;
	} else if (variant === 'card') {
		classes = `${
			isPlaying &&
			trackId === track.id &&
			type === 'user' &&
			queueId === track.userId
				? 'opacity-100'
				: 'opacity-0'
		} absolute transition-opacity group-hover:opacity-100 bottom-0 right-0 m-2 shadow-sm hidden sm:inline-flex`;
	}

	return (
		<Button
			variant={variant === 'table' ? 'ghost' : 'outline'}
			size={variant === 'table' ? 'icon-xs' : 'icon-lg'}
			type='button'
			className={classes}
			onClick={() => onClickUserTrack(track)}
		>
			{isPlaying &&
			trackId === track.id &&
			type === 'user' &&
			queueId === track.userId ? (
				<Pause
					className={`${variant === 'table' ? 'w-full translate-y-[0.5px] fill-foreground' : 'size-5'} fill-foreground`}
				/>
			) : (
				<Play
					className={`${variant === 'table' ? 'w-full translate-y-[0.5px] fill-foreground' : 'size-5'} fill-foreground`}
				/>
			)}
		</Button>
	);
}

export function PlayUserButton({
	track,
	variant
}: {
	track?: Track;
	variant: 'card' | 'set';
}) {
	const { isPlaying, type, queueId, onClickUser } = usePlayTrack();

	if (!track) {
		return null;
	}

	let classes = '';

	if (variant === 'card') {
		classes += `${isPlaying && type === 'user' && queueId === track.userId ? 'opacity-100' : 'opacity-0'} hidden sm:inline-flex absolute transition-opacity group-hover:opacity-100 bottom-0 right-0 m-2 shadow-sm`;
	}

	return (
		<Button
			variant='outline'
			size='icon-lg'
			type='button'
			className={classes}
			onClick={() => onClickUser(track)}
		>
			{isPlaying && type === 'user' && queueId === track.userId ? (
				<Pause className='size-5 fill-foreground' />
			) : (
				<Play className='size-5 fill-foreground' />
			)}
		</Button>
	);
}

export function PlayLikedTrackButton({ track }: { track?: Track }) {
	const { isPlaying, trackId, type, onClickLikedTrack } = usePlayTrack();

	if (!track) {
		return null;
	}

	return (
		<Button
			variant='outline'
			size='icon-lg'
			type='button'
			className={`${isPlaying && trackId === track.id && type === 'liked' ? 'opacity-100' : 'opacity-0'} absolute bottom-0 right-0 m-2 hidden shadow-sm transition-opacity group-hover:opacity-100 sm:inline-flex`}
			onClick={() => onClickLikedTrack(track)}
		>
			{isPlaying && trackId === track.id && type === 'liked' ? (
				<Pause className='size-5 fill-foreground' />
			) : (
				<Play className='size-5 fill-foreground' />
			)}
		</Button>
	);
}

export function PlayPlaylistTrackButton({
	track,
	playlistId,
	position
}: {
	track?: Track;
	playlistId: number;
	position: number;
}) {
	const { isPlaying, trackId, type, queueId, onClickPlaylistTrack } =
		usePlayTrack();

	if (!track) {
		return null;
	}

	return (
		<Button
			variant='ghost'
			size='icon-xs'
			type='button'
			className={`${
				isPlaying &&
				trackId === track.id &&
				type === 'playlist' &&
				queueId === playlistId
					? 'opacity-100'
					: 'opacity-0'
			} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity group-hover:opacity-100`}
			onClick={() => onClickPlaylistTrack(track, playlistId, position)}
		>
			{isPlaying &&
			trackId === track.id &&
			type === 'playlist' &&
			queueId === playlistId ? (
				<Pause className='w-full translate-y-[0.5px] fill-foreground' />
			) : (
				<Play className='w-full translate-y-[0.5px] fill-foreground' />
			)}
		</Button>
	);
}

export function PlayPlaylistButton({
	track,
	playlistId,
	variant
}: {
	track?: Track;
	playlistId: number;
	variant: 'card' | 'set';
}) {
	const { isPlaying, type, queueId, onClickPlaylist } = usePlayTrack();

	if (!track) {
		return null;
	}

	let classes = '';

	if (variant === 'card') {
		classes += `${isPlaying && type === 'playlist' && queueId === playlistId ? 'opacity-100' : 'opacity-0'} hidden sm:inline-flex transition-opacity absolute group-hover:opacity-100 bottom-0 right-0 m-2 shadow-sm`;
	}

	return (
		<Button
			variant='outline'
			size='icon-lg'
			type='button'
			className={classes}
			onClick={() => onClickPlaylist(track, playlistId)}
		>
			{isPlaying && type === 'playlist' && queueId === playlistId ? (
				<Pause className='size-5 fill-foreground' />
			) : (
				<Play className='size-5 fill-foreground' />
			)}
		</Button>
	);
}

export function PlayAlbumTrackButton({
	track,
	albumId,
	position
}: {
	track?: Track;
	albumId: number;
	position: number;
}) {
	const { isPlaying, trackId, type, queueId, onClickAlbumTrack } =
		usePlayTrack();

	if (!track) {
		return null;
	}

	return (
		<Button
			variant='ghost'
			size='icon-xs'
			type='button'
			className={`${
				isPlaying &&
				trackId === track.id &&
				type === 'album' &&
				queueId === albumId
					? 'opacity-100'
					: 'opacity-0'
			} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity group-hover:opacity-100`}
			onClick={() => onClickAlbumTrack(track, albumId, position)}
		>
			{isPlaying &&
			trackId === track.id &&
			type === 'album' &&
			queueId === albumId ? (
				<Pause className='w-full translate-y-[0.5px] fill-foreground' />
			) : (
				<Play className='w-full translate-y-[0.5px] fill-foreground' />
			)}
		</Button>
	);
}

export function PlayAlbumButton({
	track,
	albumId,
	variant
}: {
	track?: Track;
	albumId: number;
	variant: 'card' | 'set';
}) {
	const { isPlaying, type, queueId, onClickAlbum } = usePlayTrack();

	if (!track) {
		return null;
	}

	let classes = '';

	if (variant === 'card') {
		classes += `${isPlaying && type === 'album' && queueId === albumId ? 'opacity-100' : 'opacity-0'} hidden sm:inline-flex absolute transition-opacity group-hover:opacity-100 bottom-0 right-0 m-2 shadow-sm`;
	}

	return (
		<Button
			variant='outline'
			size='icon-lg'
			type='button'
			className={classes}
			onClick={() => onClickAlbum(track, albumId)}
		>
			{isPlaying && type === 'album' && queueId === albumId ? (
				<Pause className='size-5 fill-foreground' />
			) : (
				<Play className='size-5 fill-foreground' />
			)}
		</Button>
	);
}
