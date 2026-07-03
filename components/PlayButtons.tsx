'use client';

import { Pause, Play } from 'lucide-react';
import { usePlayTrackActions, usePlayTrackState } from '@/hooks/play-track';
import type { Track } from '@/services/track/track.types';
import { Button } from './ui/button';

function trackPlayLabel(title: string, isPlaying: boolean) {
	return isPlaying ? `Pause ${title}` : `Play ${title}`;
}

export function PlayUserTrackButton({
	track,
	variant
}: {
	track?: Track;
	variant: 'card' | 'table' | 'set';
}) {
	const { isPlaying, trackId, type, queueId } = usePlayTrackState();
	const { onClickUserTrack } = usePlayTrackActions();

	if (!track) {
		return null;
	}

	const isActive =
		isPlaying &&
		trackId === track.id &&
		type === 'user' &&
		queueId === track.userId;

	let classes = '';

	if (variant === 'table') {
		classes = `${isActive ? 'opacity-100' : 'opacity-0'} absolute transition-opacity group-hover:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`;
	} else if (variant === 'card') {
		classes = `${isActive ? 'opacity-100' : 'opacity-0'} absolute transition-opacity group-hover:opacity-100 bottom-0 right-0 m-2 shadow-sm hidden sm:inline-flex`;
	}

	return (
		<Button
			variant={variant === 'table' ? 'ghost' : 'outline'}
			size={variant === 'table' ? 'icon-xs' : 'icon-lg'}
			type='button'
			className={classes}
			onClick={() => onClickUserTrack(track)}
			aria-label={trackPlayLabel(track.title, isActive)}
			aria-pressed={isActive}
		>
			{isActive ? (
				<Pause
					className={`${variant === 'table' ? 'w-full translate-y-[0.5px] fill-foreground' : 'size-5'} fill-foreground`}
					aria-hidden='true'
				/>
			) : (
				<Play
					className={`${variant === 'table' ? 'w-full translate-y-[0.5px] fill-foreground' : 'size-5'} fill-foreground`}
					aria-hidden='true'
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
	const { isPlaying, type, queueId } = usePlayTrackState();
	const { onClickUser } = usePlayTrackActions();

	if (!track) {
		return null;
	}

	const isActive = isPlaying && type === 'user' && queueId === track.userId;

	let classes = '';

	if (variant === 'card') {
		classes += `${isActive ? 'opacity-100' : 'opacity-0'} hidden sm:inline-flex absolute transition-opacity group-hover:opacity-100 bottom-0 right-0 m-2 shadow-sm`;
	}

	const label = isActive
		? `Pause ${track.username}'s tracks`
		: `Play ${track.username}'s tracks`;

	return (
		<Button
			variant='outline'
			size='icon-lg'
			type='button'
			className={classes}
			onClick={() => onClickUser(track)}
			aria-label={label}
			aria-pressed={isActive}
		>
			{isActive ? (
				<Pause className='size-5 fill-foreground' aria-hidden='true' />
			) : (
				<Play className='size-5 fill-foreground' aria-hidden='true' />
			)}
		</Button>
	);
}

export function PlayLikedTrackButton({ track }: { track?: Track }) {
	const { isPlaying, trackId, type } = usePlayTrackState();
	const { onClickLikedTrack } = usePlayTrackActions();

	if (!track) {
		return null;
	}

	const isActive = isPlaying && trackId === track.id && type === 'liked';

	return (
		<Button
			variant='outline'
			size='icon-lg'
			type='button'
			className={`${isActive ? 'opacity-100' : 'opacity-0'} absolute bottom-0 right-0 m-2 hidden shadow-sm transition-opacity group-hover:opacity-100 sm:inline-flex`}
			onClick={() => onClickLikedTrack(track)}
			aria-label={trackPlayLabel(track.title, isActive)}
			aria-pressed={isActive}
		>
			{isActive ? (
				<Pause className='size-5 fill-foreground' aria-hidden='true' />
			) : (
				<Play className='size-5 fill-foreground' aria-hidden='true' />
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
	const { isPlaying, trackId, type, queueId } = usePlayTrackState();
	const { onClickPlaylistTrack } = usePlayTrackActions();

	if (!track) {
		return null;
	}

	const isActive =
		isPlaying &&
		trackId === track.id &&
		type === 'playlist' &&
		queueId === playlistId;

	return (
		<Button
			variant='ghost'
			size='icon-xs'
			type='button'
			className={`${isActive ? 'opacity-100' : 'opacity-0'} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity group-hover:opacity-100`}
			onClick={() => onClickPlaylistTrack(track, playlistId, position)}
			aria-label={trackPlayLabel(track.title, isActive)}
			aria-pressed={isActive}
		>
			{isActive ? (
				<Pause
					className='w-full translate-y-[0.5px] fill-foreground'
					aria-hidden='true'
				/>
			) : (
				<Play
					className='w-full translate-y-[0.5px] fill-foreground'
					aria-hidden='true'
				/>
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
	const { isPlaying, type, queueId } = usePlayTrackState();
	const { onClickPlaylist } = usePlayTrackActions();

	if (!track) {
		return null;
	}

	const isActive = isPlaying && type === 'playlist' && queueId === playlistId;

	let classes = '';

	if (variant === 'card') {
		classes += `${isActive ? 'opacity-100' : 'opacity-0'} hidden sm:inline-flex transition-opacity absolute group-hover:opacity-100 bottom-0 right-0 m-2 shadow-sm`;
	}

	return (
		<Button
			variant='outline'
			size='icon-lg'
			type='button'
			className={classes}
			onClick={() => onClickPlaylist(track, playlistId)}
			aria-label={isActive ? 'Pause playlist' : 'Play playlist'}
			aria-pressed={isActive}
		>
			{isActive ? (
				<Pause className='size-5 fill-foreground' aria-hidden='true' />
			) : (
				<Play className='size-5 fill-foreground' aria-hidden='true' />
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
	const { isPlaying, trackId, type, queueId } = usePlayTrackState();
	const { onClickAlbumTrack } = usePlayTrackActions();

	if (!track) {
		return null;
	}

	const isActive =
		isPlaying &&
		trackId === track.id &&
		type === 'album' &&
		queueId === albumId;

	return (
		<Button
			variant='ghost'
			size='icon-xs'
			type='button'
			className={`${isActive ? 'opacity-100' : 'opacity-0'} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity group-hover:opacity-100`}
			onClick={() => onClickAlbumTrack(track, albumId, position)}
			aria-label={trackPlayLabel(track.title, isActive)}
			aria-pressed={isActive}
		>
			{isActive ? (
				<Pause
					className='w-full translate-y-[0.5px] fill-foreground'
					aria-hidden='true'
				/>
			) : (
				<Play
					className='w-full translate-y-[0.5px] fill-foreground'
					aria-hidden='true'
				/>
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
	const { isPlaying, type, queueId } = usePlayTrackState();
	const { onClickAlbum } = usePlayTrackActions();

	if (!track) {
		return null;
	}

	const isActive = isPlaying && type === 'album' && queueId === albumId;

	let classes = '';

	if (variant === 'card') {
		classes += `${isActive ? 'opacity-100' : 'opacity-0'} hidden sm:inline-flex absolute transition-opacity group-hover:opacity-100 bottom-0 right-0 m-2 shadow-sm`;
	}

	return (
		<Button
			variant='outline'
			size='icon-lg'
			type='button'
			className={classes}
			onClick={() => onClickAlbum(track, albumId)}
			aria-label={isActive ? 'Pause album' : 'Play album'}
			aria-pressed={isActive}
		>
			{isActive ? (
				<Pause className='size-5 fill-foreground' aria-hidden='true' />
			) : (
				<Play className='size-5 fill-foreground' aria-hidden='true' />
			)}
		</Button>
	);
}
