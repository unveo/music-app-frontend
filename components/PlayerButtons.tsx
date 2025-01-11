'use client';

import { Button } from './ui/button';
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
import { usePlayTrack } from '@/hooks/play-track';
import { Track } from '@/services/track/track.types';
import { useMutation } from '@tanstack/react-query';
import { likedTrackService } from '@/services/user/liked-track/liked-track.service';
import { useDisabledLikedTracksQuery } from '@/hooks/queries';
import { usePathname } from 'next/navigation';
import { useTrackStore } from '@/stores/track.store';
import { useSettingsStore } from '@/stores/settings.store';

export function PlayButton() {
	const { isPlaying, audioReady, onClickPlay } = usePlayTrack();

	return (
		<Button
			variant='clear'
			onClick={onClickPlay}
			size='icon'
			disabled={audioReady ? false : true}
		>
			{isPlaying ? (
				<Pause className='size-5 fill-foreground' />
			) : (
				<Play className='size-5 fill-foreground' />
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
			disabled={audioReady ? false : true}
		>
			<SkipBack className='size-5 fill-foreground' />
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
			disabled={audioReady ? false : true}
		>
			<SkipForward className='size-5 fill-foreground' />
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
			disabled={audioReady ? false : true}
		>
			{shuffle ? (
				<Shuffle className='size-5 text-primary' />
			) : (
				<Shuffle className='size-5' />
			)}
		</Button>
	);
}

export function RepeatButton() {
	const { repeat, audioReady, onClickRepeat } = usePlayTrack();

	return (
		<Button
			variant='clear'
			size='icon'
			onClick={onClickRepeat}
			disabled={audioReady ? false : true}
		>
			{repeat === 'full' ? (
				<Repeat className='size-5 text-primary' />
			) : repeat === 'one' ? (
				<Repeat1 className='size-5 text-primary' />
			) : (
				<Repeat className='size-5' />
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
			<Button variant='ghost' size='icon' disabled>
				<Heart className='size-5' />
			</Button>
		);
	}

	return (
		<Button
			variant='ghost'
			onClick={async () => {
				trackInfo.likes.length
					? removeFromLikedMutation.mutate(trackInfo.id)
					: addToLikedMutation.mutate(trackInfo.id);
			}}
			size='icon'
		>
			{trackInfo.likes.length ? (
				<Heart className='size-5 fill-foreground' />
			) : (
				<Heart className='size-5' />
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
		>
			{volume && !muted ? (
				volume > 0.5 ? (
					<Volume2 className='size-5' />
				) : (
					<Volume1 className='size-5' />
				)
			) : (
				<VolumeX className='size-5' />
			)}
		</Button>
	);
}
