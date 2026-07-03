'use client';

import { useMutation } from '@tanstack/react-query';
import {
	Heart,
	Pause,
	Play,
	Repeat,
	Repeat1,
	Shuffle,
	SkipBack,
	SkipForward,
	Volume1,
	Volume2,
	VolumeX
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { usePlayTrack } from '@/hooks/play-track';
import { useDisabledLikedTracksQuery } from '@/hooks/queries';
import { likedTrackService } from '@/services/user/liked-track/liked-track.service';
import { useSettingsStore } from '@/stores/settings.store';
import { useTrackStore } from '@/stores/track.store';
import { Button } from './ui/button';

export function PlayButton() {
	const { isPlaying, audioReady, onClickPlay } = usePlayTrack();

	useEffect(() => {
		const handleSpaceKey = (event: KeyboardEvent) => {
			const activeElement = document.activeElement;

			if (
				activeElement instanceof HTMLInputElement ||
				activeElement instanceof HTMLTextAreaElement ||
				activeElement instanceof HTMLSelectElement ||
				activeElement?.getAttribute('contenteditable') === 'true'
			) {
				return;
			}

			if (event.code === 'Space') {
				event.preventDefault();
				onClickPlay();
			}
		};

		window.addEventListener('keydown', handleSpaceKey);

		return () => {
			window.removeEventListener('keydown', handleSpaceKey);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Button
			variant='clear'
			onClick={onClickPlay}
			size='icon'
			disabled={!audioReady}
			aria-label={isPlaying ? 'Pause' : 'Play'}
			aria-pressed={isPlaying}
			aria-keyshortcuts='Space'
		>
			{isPlaying ? (
				<Pause className='size-5 fill-foreground' aria-hidden='true' />
			) : (
				<Play className='size-5 fill-foreground' aria-hidden='true' />
			)}
		</Button>
	);
}

export function SkipBackButton() {
	const { audioReady, onClickSkipBack } = usePlayTrack();

	return (
		<Button
			variant='clear'
			onClick={onClickSkipBack}
			size='icon'
			disabled={!audioReady}
			aria-label='Previous track'
		>
			<SkipBack className='size-5 fill-foreground' aria-hidden='true' />
		</Button>
	);
}

export function SkipForwardButton() {
	const { audioReady, onClickSkipForward } = usePlayTrack();

	return (
		<Button
			variant='clear'
			onClick={onClickSkipForward}
			size='icon'
			disabled={!audioReady}
			aria-label='Next track'
		>
			<SkipForward className='size-5 fill-foreground' aria-hidden='true' />
		</Button>
	);
}

export function ShuffleButton() {
	const { shuffle, audioReady, onClickShuffle } = usePlayTrack();

	return (
		<Button
			variant='clear'
			size='icon'
			onClick={onClickShuffle}
			disabled={!audioReady}
			aria-label='Shuffle'
			aria-pressed={shuffle}
		>
			<Shuffle
				className={shuffle ? 'size-5 text-primary' : 'size-5'}
				aria-hidden='true'
			/>
		</Button>
	);
}

export function RepeatButton() {
	const { repeat, audioReady, onClickRepeat } = usePlayTrack();

	const repeatLabel =
		repeat === 'one'
			? 'Repeat one track'
			: repeat === 'full'
				? 'Repeat queue'
				: 'Repeat off';

	return (
		<Button
			variant='clear'
			size='icon'
			onClick={onClickRepeat}
			disabled={!audioReady}
			aria-label={repeatLabel}
			aria-pressed={repeat !== false}
		>
			{repeat === 'full' ? (
				<Repeat className='size-5 text-primary' aria-hidden='true' />
			) : repeat === 'one' ? (
				<Repeat1 className='size-5 text-primary' aria-hidden='true' />
			) : (
				<Repeat className='size-5' aria-hidden='true' />
			)}
		</Button>
	);
}

export function LikeTrackPlayerButton() {
	const { setTrackInfo } = useTrackStore();
	const trackInfo = useTrackStore.getState().trackInfo;

	const pathname = usePathname();

	const likedTracksQuery = useDisabledLikedTracksQuery();

	const addToLikedMutation = useMutation({
		mutationFn: (trackId: number) => likedTrackService.add(trackId),
		onSuccess: () => {
			if (trackInfo) {
				setTrackInfo({
					...trackInfo,
					likes: [{ addedAt: Date.now().toString() }]
				});
				if (pathname === '/library/tracks') {
					likedTracksQuery.refetch();
				}
			}
		}
	});

	const removeFromLikedMutation = useMutation({
		mutationFn: (trackId: number) => likedTrackService.remove(trackId),
		onSuccess: () => {
			if (trackInfo) {
				setTrackInfo({ ...trackInfo, likes: [] });
				if (pathname === '/library/tracks') {
					likedTracksQuery.refetch();
				}
			}
		}
	});

	if (!trackInfo) {
		return (
			<Button variant='ghost' size='icon' disabled aria-label='Like track'>
				<Heart className='size-5' aria-hidden='true' />
			</Button>
		);
	}

	const isLiked = trackInfo.likes.length > 0;

	return (
		<Button
			variant='ghost'
			onClick={async () => {
				isLiked
					? removeFromLikedMutation.mutate(trackInfo.id)
					: addToLikedMutation.mutate(trackInfo.id);
			}}
			size='icon'
			aria-label={isLiked ? 'Unlike track' : 'Like track'}
			aria-pressed={isLiked}
		>
			{isLiked ? (
				<Heart className='size-5 fill-foreground' aria-hidden='true' />
			) : (
				<Heart className='size-5' aria-hidden='true' />
			)}
		</Button>
	);
}

export function VolumeButton() {
	const { volume, muted, setVolume, setMuted } = useSettingsStore();
	const { audio } = useTrackStore();

	if (!audio) {
		return null;
	}

	const volumeLabel = muted || !volume ? 'Unmute' : 'Mute';

	return (
		<Button
			variant='clear'
			size='icon'
			onClick={() => {
				if (volume) {
					if (muted) {
						setMuted(false);
						audio.volume = volume;
					} else {
						setMuted(true);
						audio.volume = 0;
					}
				} else {
					setVolume(0.05);
					audio.volume = 0.05;
				}
			}}
			aria-label={volumeLabel}
			aria-pressed={muted || !volume}
		>
			{volume && !muted ? (
				volume > 0.5 ? (
					<Volume2 className='size-5' aria-hidden='true' />
				) : (
					<Volume1 className='size-5' aria-hidden='true' />
				)
			) : (
				<VolumeX className='size-5' aria-hidden='true' />
			)}
		</Button>
	);
}
