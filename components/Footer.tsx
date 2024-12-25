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
	Repeat1,
	Shuffle,
	SkipBack,
	SkipForward,
	Volume1,
	Volume2,
	VolumeX
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { formatTime, shuffleArray } from '@/lib/utils';
import { SliderValueChangeDetails } from '@ark-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user/user.service';
import { trackService } from '@/services/track/track.service';
import { useSettingsStore } from '@/stores/settings.store';
import { useTrackLocalStore } from '@/stores/track-local.store';
import { useTrackStore } from '@/stores/track.store';
import { useQueueStore } from '@/stores/queue.store';
import { listeningHistoryService } from '@/services/user/listening-history/listening-history.service';
import { usePathname } from 'next/navigation';
import { likedTrackService } from '@/services/user/liked-track/liked-track.service';
import { baseUrl, imageFormat, msToAddListen } from '@/config';
import { useListenTimeStore } from '@/stores/listen-time.store';

export default function Footer() {
	const {
		volume,
		muted,
		repeat,
		shuffle,
		setVolume,
		setMuted,
		setRepeat,
		setShuffle
	} = useSettingsStore();
	const { currentTime, setCurrentTime, setTrackId } = useTrackLocalStore();
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
	const { all, setNext, setPrev, setAll } = useQueueStore();
	const { listenTime, startTime, setListenTime, setStartTime } =
		useListenTimeStore();

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

	const pathname = usePathname();

	const listeningHistoryQuery = useQuery({
		queryKey: ['listening-history'],
		queryFn: () => listeningHistoryService.get(),
		enabled: false,
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false
	});

	const addToHistoryMutation = useMutation({
		mutationFn: (trackId: number) => listeningHistoryService.add(trackId),
		onSuccess: () => {
			if (pathname === '/library/history') {
				listeningHistoryQuery.refetch();
			}
		}
	});

	const likedTracksQuery = useQuery({
		queryKey: ['liked-tracks'],
		queryFn: () => likedTrackService.getMany(),
		enabled: false,
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false
	});

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

	useEffect(() => {
		if (useTrackLocalStore.getState().trackId) {
			currentTrackQuery.refetch();
		}
	}, []);

	const updateTime = useCallback(() => {
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
		const audio = useTrackStore.getState().audio;
		const repeat = useSettingsStore.getState().repeat;
		if (repeat === 'one' && audio) {
			audio.play();
			return;
		}
		if (!next.length) {
			if (repeat === 'full') {
				const track = await trackService.getOne(prev[0]);
				const newAudio = new Audio(
					`${baseUrl.backend}/api/track/stream/${prev[0]}`
				);
				setAudioReady(false);
				setCurrentTime(0);
				setProgress(0);
				setAudio(newAudio);
				setTrackInfo(track.data);
				setTrackId(prev[0]);
				setListenTime(0);
				setStartTime(undefined);
				newAudio.addEventListener('canplaythrough', onCanPlayThrough);
				newAudio.addEventListener('ended', onEnded);
				if (trackId) {
					setNext([...prev.slice(1), trackId]);
				}
				setPrev([]);
				addToHistoryMutation.mutate(prev[0]);
			} else {
				setIsPlaying(false);
				this.currentTime = 0;
			}
		} else {
			const track = await trackService.getOne(next[0]);
			const newAudio = new Audio(
				`${baseUrl.backend}/api/track/stream/${next[0]}`
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
		if (currentTrack) {
			const audio = new Audio(
				`${baseUrl.backend}/api/track/stream/${currentTrack.id}`
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
		if (audio && audioReady) {
			if (currentTime > 0 && currentTime < audio.duration) {
				audio.currentTime = currentTime;
			}
			if (volume >= 0 && volume <= 1) {
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

	useEffect(() => {
		if (trackInfo && typeof listenTime === 'number') {
			if (isPlaying && !startTime) {
				setStartTime(new Date().getTime());
			} else if (!isPlaying && startTime) {
				const newListenTime = new Date().getTime() - startTime + listenTime;
				if (newListenTime >= msToAddListen) {
					trackService.addPlay(trackInfo.id);
					setListenTime(true);
				} else {
					setListenTime(newListenTime);
				}
				setStartTime(undefined);
			}
		}
	}, [isPlaying, trackInfo]);

	useEffect(() => {
		if (trackInfo && typeof listenTime === 'number' && isPlaying && startTime) {
			const intervalId = setInterval(() => {
				if (new Date().getTime() - startTime + listenTime >= msToAddListen) {
					trackService.addPlay(trackInfo.id);
					setListenTime(true);
					setStartTime(undefined);
				}
			}, 1000);
			return () => clearInterval(intervalId);
		}
	}, [isPlaying, listenTime, startTime, trackInfo]);

	function onPointerDown() {
		if (audio) {
			setIsSeeking(true);
			audio.removeEventListener('timeupdate', updateTime);
		}
	}

	function onTrackSliderChange(details: SliderValueChangeDetails) {
		if (audio) {
			setCurrentTime(details.value[0] * audio.duration);
			setProgress(details.value[0]);
		}
	}

	function onTrackSliderChangeEnd(details: SliderValueChangeDetails) {
		if (audio) {
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
		return <FooterLayout></FooterLayout>;
	}

	return (
		<FooterLayout>
			<div className='flex items-center gap-4'>
				<Image
					alt='cover'
					src={`${baseUrl.backend}/${trackInfo.image}_50x50${imageFormat}`}
					width={50}
					height={50}
					className='aspect-square size-12 rounded-md border'
				/>
				<div className='flex max-w-20 flex-col text-sm lg:max-w-32'>
					<span>{trackInfo.title}</span>
					<Link
						href={`/${trackInfo.username}`}
						className='text-muted-foreground'
					>
						{trackInfo.username}
					</Link>
				</div>
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
			</div>
			<div className='col-start-2 col-end-5 flex flex-col pt-1'>
				<div className='flex justify-center gap-2'>
					<Button
						variant='clear'
						size='icon'
						onClick={() => {
							const trackId = useTrackLocalStore.getState().trackId;
							if (shuffle) {
								setShuffle(false);
								const all = useQueueStore.getState().all;
								if (trackId) {
									const trackIndex = all.indexOf(trackId);
									setPrev(all.slice(0, trackIndex));
									setNext(all.slice(trackIndex + 1));
								}
								setAll([]);
							} else {
								setShuffle(true);
								const prev = useQueueStore.getState().prev;
								const next = useQueueStore.getState().next;
								let newNext = [...prev, ...next];
								shuffleArray(newNext);
								setPrev([]);
								setNext(newNext);
								if (trackId) {
									setAll([...prev, trackId, ...next]);
								}
							}
						}}
					>
						{shuffle ? (
							<Shuffle className='size-5 text-primary' />
						) : (
							<Shuffle className='size-5' />
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
							const repeat = useSettingsStore.getState().repeat;
							if (audio.currentTime >= 5) {
								audio.currentTime = 0;
								audio.play();
							} else if (!prev.length) {
								if (repeat === 'full') {
									const track = await trackService.getOne(
										next[next.length - 1]
									);
									const newAudio = new Audio(
										`${baseUrl.backend}/api/track/stream/${track.data.id}`
									);
									setAudioReady(false);
									setCurrentTime(0);
									setProgress(0);
									setAudio(newAudio);
									setTrackInfo(track.data);
									setTrackId(track.data.id);
									setListenTime(0);
									setStartTime(undefined);
									newAudio.addEventListener('canplaythrough', onCanPlayThrough);
									newAudio.addEventListener('ended', onEnded);
									setNext([]);
									if (trackId) {
										let newPrev = [trackId, ...next];
										newPrev.pop();
										setPrev(newPrev);
									}
									addToHistoryMutation.mutate(track.data.id);
								} else {
									audio.currentTime = 0;
									audio.play();
								}
							} else {
								const track = await trackService.getOne(prev[prev.length - 1]);
								const newAudio = new Audio(
									`${baseUrl.backend}/api/track/stream/${track.data.id}`
								);
								setAudioReady(false);
								setCurrentTime(0);
								setProgress(0);
								setAudio(newAudio);
								setTrackInfo(track.data);
								setTrackId(track.data.id);
								setListenTime(0);
								setStartTime(undefined);
								newAudio.addEventListener('canplaythrough', onCanPlayThrough);
								newAudio.addEventListener('ended', onEnded);
								if (trackId) {
									setNext([trackId, ...next]);
								}
								setPrev(prev.slice(0, -1));
								addToHistoryMutation.mutate(track.data.id);
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
							const repeat = useSettingsStore.getState().repeat;
							if (!next.length) {
								if (repeat === 'full') {
									const track = await trackService.getOne(prev[0]);
									const newAudio = new Audio(
										`${baseUrl.backend}/api/track/stream/${prev[0]}`
									);
									setAudioReady(false);
									setCurrentTime(0);
									setProgress(0);
									setAudio(newAudio);
									setTrackInfo(track.data);
									setTrackId(prev[0]);
									setListenTime(0);
									setStartTime(undefined);
									newAudio.addEventListener('canplaythrough', onCanPlayThrough);
									newAudio.addEventListener('ended', onEnded);
									if (trackId) {
										setNext([...prev.slice(1), trackId]);
									}
									setPrev([]);
									addToHistoryMutation.mutate(prev[0]);
								} else {
									setIsPlaying(false);
									audio.currentTime = 0;
								}
							} else {
								const track = await trackService.getOne(next[0]);
								const newAudio = new Audio(
									`${baseUrl.backend}/api/track/stream/${next[0]}`
								);
								setAudioReady(false);
								setCurrentTime(0);
								setProgress(0);
								setAudio(newAudio);
								setTrackInfo(track.data);
								setTrackId(next[0]);
								setListenTime(0);
								setStartTime(undefined);
								newAudio.addEventListener('canplaythrough', onCanPlayThrough);
								newAudio.addEventListener('ended', onEnded);
								setNext(next.slice(1));
								if (trackId) {
									setPrev([...prev, trackId]);
								}
								addToHistoryMutation.mutate(next[0]);
							}
						}}
						size='icon'
						disabled={audioReady ? false : true}
					>
						<SkipForward className='size-5 fill-foreground' />
					</Button>
					<Button
						variant='clear'
						size='icon'
						onClick={() => {
							const repeat = useSettingsStore.getState().repeat;
							if (!repeat) {
								setRepeat('full');
							} else if (repeat === 'full') {
								setRepeat('one');
							} else {
								setRepeat(false);
							}
						}}
					>
						{repeat === 'full' ? (
							<Repeat className='size-5 text-primary' />
						) : repeat === 'one' ? (
							<Repeat1 className='size-5 text-primary' />
						) : (
							<Repeat className='size-5' />
						)}
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
