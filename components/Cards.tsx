'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Pause, Play } from 'lucide-react';
import { cn, nFormatter } from '@/lib/utils';
import type { Album } from '@/services/album/album.types';
import type { Playlist } from '@/services/playlist/playlist.types';
import type { TracksIds, Track } from '@/services/track/track.types';
import type {
	UserPublic,
	UserWithoutFollowingCount
} from '@/services/user/user.types';
import { useTrackStore } from '@/stores/track.store';
import { useTrackLocalStore } from '@/stores/track-local.store';
import { trackService } from '@/services/track/track.service';
import { useQueueStore } from '@/stores/queue.store';
import { listeningHistoryService } from '@/services/user/listening-history/listening-history.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { AxiosResponse } from 'axios';
import { likedTrackService } from '@/services/user/liked-track/liked-track.service';
import { albumTrackService } from '@/services/album/album-track/album-track.service';
import { playlistTrackService } from '@/services/playlist/playlist-track/playlist-track.service';
import { useMemo } from 'react';
import { baseUrl, imageFormat } from '@/config';
import { useListenTimeStore } from '@/stores/listen-time.store';

type queue = 'user' | 'liked' | 'album' | 'playlist';

export function Card({
	title,
	desc,
	titleHref,
	descHref,
	imageSrc,
	centered,
	roundedFull,
	queueType,
	track,
	trackPosition
}: {
	title: string;
	desc?: string;
	titleHref?: string;
	descHref?: string;
	imageSrc: string;
	centered?: boolean;
	roundedFull?: boolean;
	queueType?: queue;
	track?: Track;
	trackPosition?: number;
}) {
	const roundedClass = useMemo(
		() => (roundedFull ? 'rounded-full' : 'rounded-md'),
		[roundedFull]
	);

	return (
		<li className='flex flex-col gap-2'>
			<div className={cn(roundedClass, 'group relative border')}>
				{titleHref ? (
					<Link href={titleHref} className={cn(roundedClass, 'aspect-square')}>
						<Image
							alt='Track image'
							src={imageSrc}
							width={250}
							height={250}
							priority
							className={cn(roundedClass, 'aspect-square')}
						></Image>
					</Link>
				) : (
					<Image
						alt='Track image'
						src={imageSrc}
						width={250}
						height={250}
						priority
						className={cn(roundedClass, 'aspect-square cursor-pointer')}
					></Image>
				)}
				{queueType && track && (
					<PlayButton
						track={track}
						queueType={queueType}
						trackPosition={trackPosition}
					/>
				)}
			</div>
			<div className={cn(centered && 'items-center', 'flex flex-col')}>
				{titleHref ? (
					<Link href={titleHref} className='w-min text-nowrap'>
						{title}
					</Link>
				) : (
					<span className='w-min text-nowrap'>{title}</span>
				)}
				{desc ? (
					descHref ? (
						<Link
							href={descHref}
							className='w-min text-nowrap text-muted-foreground'
						>
							{desc}
						</Link>
					) : (
						<span className='w-min text-nowrap text-muted-foreground'>
							{desc}
						</span>
					)
				) : (
					<></>
				)}
			</div>
		</li>
	);
}

function PlayButton({
	track,
	queueType,
	trackPosition
}: {
	track: Track;
	queueType: 'user' | 'liked' | 'album' | 'playlist';
	trackPosition?: number;
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
		if (!next.length) {
			setIsPlaying(false);
			this.currentTime = 0;
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

	return (
		<Button
			variant='outline'
			size='icon-lg'
			className='absolute bottom-0 right-0 m-2 opacity-0 shadow-sm transition-opacity group-hover:opacity-100'
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
					if (queueType === 'user') {
						tracksIds = await trackService.getManyIds(track.userId, track.id);
					} else if (queueType === 'album') {
						tracksIds = await albumTrackService.getManyIds(
							track.userId,
							trackPosition ? trackPosition : 0
						);
					} else if (queueType === 'playlist') {
						tracksIds = await playlistTrackService.getManyIds(
							track.userId,
							trackPosition ? trackPosition : 0
						);
					} else {
						tracksIds = await likedTrackService.getManyIds(track.id);
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
				<Pause className='size-5 fill-foreground' />
			) : (
				<Play className='size-5 fill-foreground' />
			)}
		</Button>
	);
}

export function CardSkeleton() {
	return (
		<li className='flex flex-col gap-2'>
			<div className='aspect-square cursor-pointer rounded-md bg-skeleton'></div>
			<div className='flex flex-col gap-2'>
				<div className='h-4 w-20 rounded-md bg-skeleton'></div>
				<div className='h-4 w-20 rounded-md bg-skeleton'></div>
			</div>
		</li>
	);
}

export function UserCard({
	user
}: {
	user: UserPublic | UserWithoutFollowingCount;
}) {
	return (
		<Card
			title={user.username}
			titleHref={`/${user.username}`}
			desc={`${nFormatter(user._count.followers)} followers`}
			imageSrc={`${baseUrl.backend}/${user.image}_250x250${imageFormat}`}
			centered
			roundedFull
		></Card>
	);
}

export function TrackCard({ track }: { track: Track }) {
	return (
		<Card
			title={track.title}
			desc={track.createdAt.slice(0, 4)}
			imageSrc={`${baseUrl.backend}/${track.image}_250x250${imageFormat}`}
			track={track}
			queueType='user'
		></Card>
	);
}

export function LikedTrackCard({ track }: { track: Track }) {
	return (
		<Card
			title={track.title}
			desc={track.username}
			descHref={`/${track.username}`}
			imageSrc={`${baseUrl.backend}/${track.image}_250x250${imageFormat}`}
			track={track}
			queueType='liked'
		></Card>
	);
}

export function ListeningHistoryCard({ track }: { track: Track }) {
	return (
		<Card
			title={track.title}
			desc={track.username}
			descHref={`/${track.username}`}
			imageSrc={`${baseUrl.backend}/${track.image}_250x250${imageFormat}`}
			track={track}
			queueType='user'
		></Card>
	);
}

export function PlaylistCardProfile({ playlist }: { playlist: Playlist }) {
	return (
		<Card
			title={playlist.title}
			titleHref={`/${playlist.username}/playlists/${playlist.changeableId}`}
			desc={playlist.createdAt.slice(0, 4)}
			imageSrc={`${baseUrl.backend}/${playlist.image}_250x250${imageFormat}`}
		></Card>
	);
}

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
	return (
		<Card
			title={playlist.title}
			titleHref={`/${playlist.username}/playlists/${playlist.changeableId}`}
			desc={playlist.username}
			descHref={`/${playlist.username}`}
			imageSrc={`${baseUrl.backend}/${playlist.image}_250x250${imageFormat}`}
		></Card>
	);
}

export function AlbumCardProfile({ album }: { album: Album }) {
	return (
		<Card
			title={album.title}
			titleHref={`/${album.username}/albums/${album.changeableId}`}
			desc={
				album.createdAt.slice(0, 4) +
				' • ' +
				(album.type === 'ep'
					? album.type.toUpperCase()
					: album.type[0].toUpperCase() + album.type.slice(1))
			}
			imageSrc={`${baseUrl.backend}/${album.image}_250x250${imageFormat}`}
		></Card>
	);
}

export function AlbumCard({ album }: { album: Album }) {
	return (
		<Card
			title={album.title}
			titleHref={`/${album.username}/albums/${album.changeableId}`}
			desc={album.username}
			descHref={`/${album.username}`}
			imageSrc={`${baseUrl.backend}/${album.image}_250x250${imageFormat}`}
		></Card>
	);
}
