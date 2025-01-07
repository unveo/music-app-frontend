'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn, nFormatter } from '@/lib/utils';
import type { Album } from '@/services/album/album.types';
import type { Playlist } from '@/services/playlist/playlist.types';
import type { Track } from '@/services/track/track.types';
import type {
	UserPublic,
	UserWithoutFollowingCount
} from '@/services/user/user.types';
import { useMemo } from 'react';
import { baseUrl, imageFormat } from '@/config';
import { PlayButton } from './PlayButtons';

type Queue = 'user' | 'liked' | 'album' | 'playlist';

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
	queueType?: Queue;
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
						queueInfo={{
							queueType,
							trackPosition
						}}
						forCard
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
			titleHref={`/${track.username}/${track.changeableId}`}
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
			titleHref={`/${track.username}/${track.changeableId}`}
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
			titleHref={`/${track.username}/${track.changeableId}`}
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
