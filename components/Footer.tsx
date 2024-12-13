'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Heart,
	Pause,
	Play,
	Repeat,
	Shuffle,
	SkipBack,
	SkipForward,
	Volume1,
	Volume2,
	VolumeX
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/utils';
import { SliderValueChangeDetails } from '@ark-ui/react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user/user.service';
import { trackService } from '@/services/track/track.service';
import { useSettingsStore } from '@/stores/settings.store';
import { useTrackLocalStore } from '@/stores/track-local.store';
import { useTrackStore } from '@/stores/track.store';

export default function Footer() {
	const { volume, muted, setVolume, setMuted } = useSettingsStore();
	const { trackId, currentTime, setCurrentTime } = useTrackLocalStore();
	const {
		trackInfo,
		isPlaying,
		audio,
		audioReady,
		progress,
		setIsPlaying,
		setTrackInfo,
		setAudio,
		setAudioReady,
		setProgress
	} = useTrackStore();
	const [isSeeking, setIsSeeking] = useState(false);

	const currentUserQuery = useQuery({
		queryKey: ['current-user'],
		queryFn: () => userService.getCurrent()
	});
	const currentUser = currentUserQuery.data?.data;

	const currentTrackQuery = useQuery({
		queryKey: ['current-track'],
		queryFn: () => trackService.getOne(trackId!),
		enabled: !!trackId,
		retry: false,
		refetchOnMount: true,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false
	});
	const currentTrack = currentTrackQuery.data?.data;

	const updateTime = useCallback(() => {
		console.log('UPDATE TIME');
		if (audio && !isSeeking) {
			setCurrentTime(audio.currentTime);
			setProgress(audio.currentTime / audio.duration);
		}
	}, [isSeeking, audio]);

	function onCanPlayThrough() {
		setAudioReady(true);
	}

	useEffect(() => {
		console.log('currentTrack EFFECT', currentTrack);
		if (currentTrack) {
			console.log('currentTrack AUDIO CREATE');
			const audio = new Audio(
				`http://localhost:5000/api/track/stream/${currentTrack.id}`
			);
			setAudio(audio);
			setTrackInfo(currentTrack);
			audio.addEventListener('canplaythrough', onCanPlayThrough);

			return () => {
				audio.removeEventListener('canplaythrough', onCanPlayThrough);
			};
		}
	}, [currentTrack]);

	useEffect(() => {
		console.log(audioReady, 'AUDIO READY CHANGE');
		if (audio && audioReady) {
			if (currentTime > 0 && currentTime < audio.duration) {
				audio.currentTime = currentTime;
			}
			if (volume >= 0 && volume <= 1) {
				console.log('VOLUME CHANGE');
				if (muted) {
					audio.volume = 0;
				} else {
					audio.volume = volume;
				}
			}
		}
	}, [audioReady]);

	useEffect(() => {
		if (audio && !isSeeking) {
			audio.addEventListener('timeupdate', updateTime);
			return () => {
				audio.removeEventListener('timeupdate', updateTime);
			};
		}
	}, [audio, updateTime]);

	function onPointerDown() {
		if (audio) {
			console.log('pointer down');
			setIsSeeking(true);
			audio.removeEventListener('timeupdate', updateTime);
		}
	}

	function onTrackSliderChange(details: SliderValueChangeDetails) {
		if (audio) {
			console.log('change');
			setCurrentTime(details.value[0] * audio.duration);
			setProgress(details.value[0]);
		}
	}

	function onTrackSliderChangeEnd(details: SliderValueChangeDetails) {
		if (audio) {
			console.log('commit');
			setIsSeeking(false);
			audio.currentTime = details.value[0] * audio.duration;
		}
	}

	function onVolumeChange(details: SliderValueChangeDetails) {
		if (muted) {
			setMuted(false);
		}
		setVolume(details.value[0]);
		if (audio) {
			audio.volume = details.value[0];
		}
	}

	if (!currentUser || !trackInfo || !audio) {
		console.log(
			!!currentUser,
			!!currentTrack,
			!!trackInfo,
			audio,
			!!audioReady
		);
		return <FooterLayout></FooterLayout>;
	}

	return (
		<FooterLayout>
			<div className='flex items-center gap-4'>
				<Image
					alt='cover'
					src={`http://localhost:5000/${trackInfo.image}`}
					width={100}
					height={100}
					className='aspect-square size-12 rounded-md border object-cover'
				/>
				<div className='flex max-w-20 flex-col text-sm lg:max-w-32'>
					<span>{trackInfo.title}</span>
					<Link
						href={trackInfo.user.username}
						className='text-muted-foreground'
					>
						{trackInfo.user.username}
					</Link>
				</div>
				<Button variant='ghost' size='icon'>
					<Heart className='size-5' />
				</Button>
			</div>
			<div className='col-start-2 col-end-5 flex flex-col pt-1'>
				<div className='flex justify-center gap-2'>
					<Button variant='clear' size='icon'>
						<Shuffle className='size-5' />
					</Button>
					<Button
						variant='clear'
						size='icon'
						disabled={audioReady ? false : true}
					>
						<SkipBack className='size-5 fill-foreground' />
					</Button>
					<Button
						variant='clear'
						onClick={() => {
							if (isPlaying) {
								audio.pause();
								setIsPlaying(false);
							} else {
								audio.play();
								setIsPlaying(true);
							}
						}}
						size='icon'
						disabled={audioReady ? false : true}
					>
						{isPlaying ? (
							<Pause className='size-5 fill-foreground' />
						) : (
							<Play className='size-5 fill-foreground' />
						)}
					</Button>
					<Button
						variant='clear'
						size='icon'
						disabled={audioReady ? false : true}
					>
						<SkipForward className='size-5 fill-foreground' />
					</Button>
					<Button variant='clear' size='icon'>
						<Repeat className='size-5' />
					</Button>
				</div>
				<div className='flex items-center justify-center gap-2 text-xs'>
					<span className='w-12 text-end'>
						{audioReady ? formatTime(currentTime) : '0:00'}
					</span>
					<Slider
						value={[progress]}
						onPointerDown={onPointerDown}
						onValueChange={onTrackSliderChange}
						onValueChangeEnd={onTrackSliderChangeEnd}
						max={1}
						step={0.01}
						disabled={audioReady ? false : true}
						className='w-52 md:w-80 lg:w-[26rem]'
					/>
					<span className='w-12'>{formatTime(trackInfo.duration)}</span>
				</div>
			</div>
			<div className='col-start-5 flex items-center justify-end gap-1'>
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
				<Slider
					value={[muted ? 0 : volume]}
					onValueChange={onVolumeChange}
					max={1}
					step={0.01}
					className='w-28'
				/>
			</div>
		</FooterLayout>
	);
}

function FooterLayout({
	children
}: Readonly<{
	children?: React.ReactNode;
}>) {
	return (
		<footer className='sticky bottom-0 flex h-16 justify-center border-t bg-background'>
			<div className='col- grid h-full w-full max-w-[80rem] grid-cols-5 px-2'>
				{children}
			</div>
		</footer>
	);
}
