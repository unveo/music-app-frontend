import type { TracksIds, Track } from '@/services/track/track.types';
import type { AxiosResponse } from 'axios';
import { Button } from './ui/button';
import { Pause, Play } from 'lucide-react';
import { useTrackStore } from '@/stores/track.store';
import { useTrackLocalStore } from '@/stores/track-local.store';
import { trackService } from '@/services/track/track.service';
import { useQueueStore } from '@/stores/queue.store';
import { listeningHistoryService } from '@/services/user/listening-history/listening-history.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { likedTrackService } from '@/services/user/liked-track/liked-track.service';
import { albumTrackService } from '@/services/album/album-track/album-track.service';
import { playlistTrackService } from '@/services/playlist/playlist-track/playlist-track.service';
import { baseUrl } from '@/config';
import { useListenTimeStore } from '@/stores/listen-time.store';
import { useSettingsStore } from '@/stores/settings.store';
import { useEffect } from 'react';

export function PlayButton({
	track,
	queueInfo,
	inTable,
	forCard
}: {
	track?: Track;
	queueInfo: {
		queueType: 'user' | 'liked' | 'album' | 'playlist';
		playlistId?: number;
		playlistTracks?: Track[];
		albumId?: number;
		trackPosition?: number;
	};
	playlistId?: number;
	inTable?: boolean;
	forCard?: boolean;
}) {
	const {
		trackInfo,
		isPlaying,
		audio,
		setTrackInfo,
		setIsPlaying,
		setAudio,
		setAudioReady,
		setProgress
	} = useTrackStore();
	const { trackId, setTrackId, setCurrentTime } = useTrackLocalStore();
	const { setNext, setPrev } = useQueueStore();
	const { setListenTime, setStartTime } = useListenTimeStore();

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
				const track = await trackService.getOneById(prev[0]);
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
			const track = await trackService.getOneById(next[0]);
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

	if (track) {
		return (
			<Button
				variant={inTable ? 'ghost' : 'outline'}
				size={inTable ? 'icon-xs' : 'icon-lg'}
				type='button'
				className={
					!forCard
						? inTable
							? 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-0 group-hover:opacity-100'
							: ''
						: `${isPlaying && trackId === track.id ? 'opacity-100' : 'opacity-0'} absolute bottom-0 right-0 m-2 shadow-sm transition-opacity group-hover:opacity-100`
				}
				onClick={async () => {
					if (!trackInfo || trackInfo.id !== track.id) {
						if (isPlaying && audio) {
							audio.pause();
						}
						const newAudio = new Audio(
							`${baseUrl.backend}/api/track/stream/${track.id}`
						);
						setAudioReady(false);
						setCurrentTime(0);
						setProgress(0);
						setAudio(newAudio);
						setTrackInfo(track);
						setTrackId(track.id);
						setListenTime(0);
						setStartTime(undefined);
						newAudio.addEventListener('canplaythrough', onCanPlayThrough);
						newAudio.addEventListener('ended', onEnded);
						let tracksIds: AxiosResponse<TracksIds, any>;
						if (queueInfo.queueType === 'user') {
							tracksIds = await trackService.getManyIds(track.userId, track.id);
						} else if (queueInfo.queueType === 'album' && queueInfo.albumId) {
							tracksIds = await albumTrackService.getManyIds(
								queueInfo.albumId,
								queueInfo.trackPosition ? queueInfo.trackPosition : 0
							);
						} else if (
							queueInfo.queueType === 'playlist' &&
							queueInfo.playlistId
						) {
							console.log('PRVET');
							tracksIds = await playlistTrackService.getManyIds(
								queueInfo.playlistId,
								queueInfo.trackPosition ? queueInfo.trackPosition : 0
							);
						} else {
							tracksIds = await likedTrackService.getManyIds(track.id); //
						}
						setPrev(tracksIds.data.prevIds);
						setNext(tracksIds.data.nextIds);
						addToHistoryMutation.mutate(track.id);
					} else {
						if (audio) {
							if (!isPlaying) {
								audio.play();
								setIsPlaying(true);
							} else {
								audio.pause();
								setIsPlaying(false);
							}
						}
					}
				}}
			>
				{isPlaying && trackId === track.id ? (
					<Pause
						className={
							inTable
								? 'w-full translate-y-[0.5px] fill-foreground'
								: 'size-5 fill-foreground'
						}
					/>
				) : (
					<Play
						className={
							inTable
								? 'w-full translate-y-[0.5px] fill-foreground'
								: 'size-5 fill-foreground'
						}
					/>
				)}
			</Button>
		);
	}
}
