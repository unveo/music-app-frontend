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
import { useQueueStore } from '@/stores/queue.store';

export default function Footer() {
	const { volume, muted, setVolume, setMuted } = useSettingsStore();
	const { trackId, currentTime, setCurrentTime, setTrackId } =
		useTrackLocalStore();
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
	const { setNext, setPrev } = useQueueStore();

	const currentUserQuery = useQuery({
		queryKey: ['current-user'],
		queryFn: () => userService.getCurrent()
	});
	const currentUser = currentUserQuery.data?.data;

	const currentTrackQuery = useQuery({
		queryKey: ['current-track'],
		queryFn: () => trackService.getOne(useTrackLocalStore.getState().trackId!),
		enabled: false,
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false
	});
	const currentTrack = currentTrackQuery.data?.data;

	useEffect(() => {
		console.log(useTrackLocalStore.getState().trackId);
		if (useTrackLocalStore.getState().trackId) {
			console.log('hekosda2');
			currentTrackQuery.refetch();
		}
	}, []);

	const updateTime = useCallback(() => {
		console.log('UPDATE TIME');
		if (audio && !isSeeking) {
			setCurrentTime(audio.currentTime);
			setProgress(audio.currentTime / audio.duration);
		}
	}, [isSeeking, audio]);

	function onCanPlayThroughFirstLoad() {
		setAudioReady(true);
	}

	function onCanPlayThrough(this: HTMLAudioElement) {
		if (!useTrackStore.getState().audioReady) {
			setAudioReady(true);
			this.play();
			setIsPlaying(true);
		}
	}

	async function onEnded(this: HTMLAudioElement) {
		const prev = useQueueStore.getState().prev;
		const next = useQueueStore.getState().next;
		const trackId = useTrackLocalStore.getState().trackId;
		if (!next.length) {
			setIsPlaying(false);
			this.currentTime = 0;
		} else {
			const track = await trackService.getOne(next[0]);
			const newAudio = new Audio(
				`http://localhost:5000/api/track/stream/${next[0]}`
			);
			setAudioReady(false);
			setCurrentTime(0);
			setProgress(0);
			setAudio(newAudio);
			setTrackInfo(track.data);
			setTrackId(next[0]);
			newAudio.addEventListener('canplaythrough', onCanPlayThrough);
			newAudio.addEventListener('ended', onEnded);
			setNext(next.slice(1));
			if (trackId) {
				setPrev([...prev, trackId]);
			}
		}
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
			audio.addEventListener('canplaythrough', onCanPlayThroughFirstLoad);
			audio.addEventListener('ended', onEnded);

			return () => {
				audio.removeEventListener('canplaythrough', onCanPlayThroughFirstLoad);
				audio.removeEventListener('ended', onEnded);
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
						onClick={async () => {
							if (isPlaying) {
								audio.pause();
							}
							const prev = useQueueStore.getState().prev;
							const next = useQueueStore.getState().next;
							const trackId = useTrackLocalStore.getState().trackId;
							if (audio.currentTime >= 5) {
								audio.currentTime = 0;
								audio.play();
							} else if (!prev.length) {
								setIsPlaying(false);
								audio.currentTime = 0;
							} else {
								const track = await trackService.getOne(prev[prev.length - 1]);
								const newAudio = new Audio(
									`http://localhost:5000/api/track/stream/${track.data.id}`
								);
								setAudioReady(false);
								setCurrentTime(0);
								setProgress(0);
								setAudio(newAudio);
								setTrackInfo(track.data);
								setTrackId(track.data.id);
								newAudio.addEventListener('canplaythrough', onCanPlayThrough);
								newAudio.addEventListener('ended', onEnded);
								if (trackId) {
									setNext([trackId, ...next]);
								}
								setPrev(prev.slice(0, -1));
							}
						}}
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
						onClick={async () => {
							if (isPlaying) {
								audio.pause();
							}
							const prev = useQueueStore.getState().prev;
							const next = useQueueStore.getState().next;
							const trackId = useTrackLocalStore.getState().trackId;
							if (!next.length) {
								setIsPlaying(false);
								audio.currentTime = 0;
							} else {
								const track = await trackService.getOne(next[0]);
								const newAudio = new Audio(
									`http://localhost:5000/api/track/stream/${next[0]}`
								);
								setAudioReady(false);
								setCurrentTime(0);
								setProgress(0);
								setAudio(newAudio);
								setTrackInfo(track.data);
								setTrackId(next[0]);
								newAudio.addEventListener('canplaythrough', onCanPlayThrough);
								newAudio.addEventListener('ended', onEnded);
								setNext(next.slice(1));
								if (trackId) {
									setPrev([...prev, trackId]);
								}
							}
						}}
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
