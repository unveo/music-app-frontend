import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Play } from 'lucide-react';
import { cn, nFormatter } from '@/lib/utils';
import type { AlbumWithUsername } from '@/services/album/album.types';
import type { PlaylistWithUsername } from '@/services/playlist/playlist.types';
import type { Track, TrackWithUsername } from '@/services/track/track.types';
import type {
	UserPublic,
	UserWithoutFollowingCount
} from '@/services/user/user.types';

export function Card({
	title,
	desc,
	titleHref,
	descHref,
	imageSrc,
	centered,
	roundedFull,
	playButton
}: {
	title: string;
	desc?: string;
	titleHref?: string;
	descHref?: string;
	imageSrc: string;
	centered?: boolean;
	roundedFull?: boolean;
	playButton?: boolean;
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
							width={320}
							height={320}
							className={cn(roundedClass, 'aspect-square')}
						></Image>
					</Link>
				) : (
					<Image
						alt='track-image'
						src={imageSrc}
						width={320}
						height={320}
						className={cn(roundedClass, 'aspect-square cursor-pointer')}
					></Image>
				)}
				{playButton ? (
					<Button
						variant='ghost'
						className='absolute bottom-0 right-0 m-2 size-12 rounded-full border bg-background p-0 opacity-0 shadow-sm transition-opacity group-hover:opacity-100'
					>
						<Play className='size-5 fill-foreground'></Play>
					</Button>
				) : (
					<></>
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
			imageSrc={`http:localhost:5000/${user.image}`}
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
			imageSrc={`http:localhost:5000/${track.image}`}
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
