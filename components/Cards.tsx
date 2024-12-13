import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Pause, Play } from 'lucide-react';
import { cn, nFormatter } from '@/lib/utils';
import type { AlbumWithUsername } from '@/services/album/album.types';
import type { PlaylistWithUsername } from '@/services/playlist/playlist.types';
import type { Track, TrackWithUsername } from '@/services/track/track.types';
import type {
	UserPublic,
	UserWithoutFollowingCount
} from '@/services/user/user.types';
import { useTrackStore } from '@/stores/track.store';
import { useTrackLocalStore } from '@/stores/track-local.store';
import { useQuery } from '@tanstack/react-query';
import { trackService } from '@/services/track/track.service';
import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/settings.store';

export function Card({
	title,
	desc,
	titleHref,
	descHref,
	imageSrc,
	centered,
	roundedFull,
	playButton,
	track
}: {
	title: string;
	desc?: string;
	titleHref?: string;
	descHref?: string;
	imageSrc: string;
	centered?: boolean;
	roundedFull?: boolean;
	playButton?: boolean;
	track?: TrackWithUsername;
}) {
	const roundedClass = roundedFull ? 'rounded-full' : 'rounded-md';

	return (
		<li className='flex flex-col gap-2'>
			<div className={cn(roundedClass, 'group relative border')}>
				{titleHref ? (
					<Link href={titleHref} className={cn(roundedClass, 'aspect-square')}>
						<Image
							alt='track-image'
							src={imageSrc}
							width={500}
							height={500}
							className={cn(roundedClass, 'aspect-square object-cover')}
						></Image>
					</Link>
				) : (
					<Image
						alt='track-image'
						src={imageSrc}
						width={500}
						height={500}
						className={cn(
							roundedClass,
							'aspect-square cursor-pointer object-cover'
						)}
					></Image>
				)}
				{playButton && track && <PlayButton track={track!} />}
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

function PlayButton({ track }: { track: TrackWithUsername }) {
	const {
		trackInfo,
		isPlaying,
		audio,
		audioReady,
		progress,
		setTrackInfo,
		setIsPlaying,
		setAudio,
		setAudioReady,
		setProgress
	} = useTrackStore();
	const { trackId, setTrackId, setCurrentTime } = useTrackLocalStore();

	function onCanPlayThrough(this: HTMLAudioElement) {
		setAudioReady(true);
		this.play();
		setIsPlaying(true);
	}

	return (
		<Button
			variant='outline'
			size='icon-lg'
			className='absolute bottom-0 right-0 m-2 opacity-0 shadow-sm transition-opacity group-hover:opacity-100'
			onClick={() => {
				if (!trackInfo || trackInfo.id !== track.id) {
					if (isPlaying && audio) {
						audio.pause();
					}
					const newAudio = new Audio(
						`http://localhost:5000/api/track/stream/${track.id}`
					);
					setAudioReady(false);
					setCurrentTime(0);
					setProgress(0);
					setAudio(newAudio);
					setTrackInfo(track);
					setTrackId(track.id);
					newAudio.addEventListener('canplaythrough', onCanPlayThrough);
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
			imageSrc={`http:localhost:5000/${user.image}`}
			centered
			roundedFull
		></Card>
	);
}

export function TrackCard({ track }: { track: TrackWithUsername }) {
	return (
		<Card
			title={track.title}
			desc={track.createdAt.slice(0, 4)}
			imageSrc={`http:localhost:5000/${track.image}`}
			track={track}
			playButton
		></Card>
	);
}

export function ListeningHistoryCard({ track }: { track: TrackWithUsername }) {
	return (
		<Card
			title={track.title}
			desc={track.user.username}
			descHref={`/${track.user.username}`}
			imageSrc={`http:localhost:5000/${track.image}`}
			track={track}
			playButton
		></Card>
	);
}

export function PlaylistCard({ playlist }: { playlist: PlaylistWithUsername }) {
	return (
		<Card
			title={playlist.title}
			titleHref={`/${playlist.user.username}/playlists/${playlist.title}`}
			desc={playlist.user.username}
			descHref={`/${playlist.user.username}`}
			imageSrc={`http:localhost:5000/${playlist.image}`}
			playButton
		></Card>
	);
}

export function AlbumCardProfile({ album }: { album: AlbumWithUsername }) {
	return (
		<Card
			title={album.title}
			titleHref={`/${album.user.username}/albums/${album.title}`}
			desc={
				album.createdAt.slice(0, 4) +
				' • ' +
				album.type[0].toUpperCase() +
				album.type.slice(1)
			}
			imageSrc={`http:localhost:5000/${album.image}`}
		></Card>
	);
}

export function AlbumCard({ album }: { album: AlbumWithUsername }) {
	return (
		<Card
			title={album.title}
			titleHref={`/${album.user.username}/albums/${album.title}`}
			desc={album.user.username}
			descHref={`/${album.user.username}`}
			imageSrc={`http:localhost:5000/${album.image}`}
		></Card>
	);
}
