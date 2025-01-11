'use client';

import type { Album } from '@/services/album/album.types';
import type { Playlist } from '@/services/playlist/playlist.types';
import type { Track } from '@/services/track/track.types';
import type {
	UserPublic,
	UserWithoutFollowingCount
} from '@/services/user/user.types';
import Image from 'next/image';
import Link from 'next/link';
import { nFormatter } from '@/lib/utils';
import { baseUrl, LARGE_IMAGE_ENDING } from '@/config';
import {
	PlayAlbumButton,
	PlayLikedTrackButton,
	PlayPlaylistButton,
	PlayUserButton,
	PlayUserTrackButton
} from './PlayButtons';
import {
	useFirstAlbumTrackQuery,
	useFirstPlaylistTrackQuery,
	useFirstTrackQuery
} from '@/hooks/queries';

export function UserCard({
	user
}: {
	user: UserPublic | UserWithoutFollowingCount;
}) {
	const firstTrackQuery = useFirstTrackQuery(user.id);
	const firstTrack = firstTrackQuery.data?.data;

	return (
		<li className='flex flex-col gap-2'>
			<div className='group relative rounded-full border'>
				<Link href={`/${user.username}`} className='aspect-square rounded-full'>
					<Image
						alt='Track image'
						src={`${baseUrl.backend}/${user.image}${LARGE_IMAGE_ENDING}`}
						width={250}
						height={250}
						priority
						className='aspect-square rounded-full'
					></Image>
				</Link>
				{firstTrack && firstTrack.length ? (
					<PlayUserButton track={firstTrack[0]} variant='card' />
				) : null}
			</div>
			<div className='flex flex-col items-center'>
				<Link href={`/${user.username}`} className='max-w-full truncate'>
					{user.username}
				</Link>
				<span className='max-w-full truncate text-muted-foreground'>
					{`${nFormatter(user._count.followers)} followers`}
				</span>
			</div>
		</li>
	);
}

export function TrackCard({ track }: { track: Track }) {
	return (
		<li className='flex flex-col gap-2'>
			<div className='group relative rounded-md border'>
				<Link
					href={`/${track.username}/${track.changeableId}`}
					className='aspect-square rounded-md'
				>
					<Image
						alt='Track image'
						src={`${baseUrl.backend}/${track.image}${LARGE_IMAGE_ENDING}`}
						width={250}
						height={250}
						priority
						className='aspect-square rounded-md'
					></Image>
				</Link>
				<PlayUserTrackButton track={track} variant='card' />
			</div>
			<div className='flex flex-col'>
				<Link
					href={`/${track.username}/${track.changeableId}`}
					className='max-w-full truncate'
				>
					{track.title}
				</Link>
				<span className='max-w-full truncate text-muted-foreground'>
					{track.createdAt.slice(0, 4)}
				</span>
			</div>
		</li>
	);
}

export function LikedTrackCard({ track }: { track: Track }) {
	return (
		<li className='flex flex-col gap-2'>
			<div className='group relative rounded-md border'>
				<Link
					href={`/${track.username}/${track.changeableId}`}
					className='aspect-square rounded-md'
				>
					<Image
						alt='Track image'
						src={`${baseUrl.backend}/${track.image}${LARGE_IMAGE_ENDING}`}
						width={250}
						height={250}
						priority
						className='aspect-square rounded-md'
					></Image>
				</Link>
				<PlayLikedTrackButton track={track} />
			</div>
			<div className='flex flex-col'>
				<Link
					href={`/${track.username}/${track.changeableId}`}
					className='max-w-full truncate'
				>
					{track.title}
				</Link>
				<Link
					href={`/${track.username}`}
					className='max-w-full truncate text-muted-foreground'
				>
					{track.username}
				</Link>
			</div>
		</li>
	);
}

export function ListeningHistoryCard({ track }: { track: Track }) {
	return (
		<li className='flex flex-col gap-2'>
			<div className='group relative rounded-md border'>
				<Link
					href={`/${track.username}/${track.changeableId}`}
					className='aspect-square rounded-md'
				>
					<Image
						alt='Track image'
						src={`${baseUrl.backend}/${track.image}${LARGE_IMAGE_ENDING}`}
						width={250}
						height={250}
						priority
						className='aspect-square rounded-md'
					></Image>
				</Link>
				<PlayUserTrackButton track={track} variant='card' />
			</div>
			<div className='flex flex-col'>
				<Link
					href={`/${track.username}/${track.changeableId}`}
					className='max-w-full truncate'
				>
					{track.title}
				</Link>
				<Link
					href={`/${track.username}`}
					className='max-w-full truncate text-muted-foreground'
				>
					{track.username}
				</Link>
			</div>
		</li>
	);
}

export function PlaylistCardProfile({ playlist }: { playlist: Playlist }) {
	const firstTrackQuery = useFirstPlaylistTrackQuery(playlist.id);
	const firstTrack = firstTrackQuery.data?.data;

	return (
		<li className='flex flex-col gap-2'>
			<div className='group relative rounded-md border'>
				<Link
					href={`/${playlist.username}/playlists/${playlist.changeableId}`}
					className='aspect-square rounded-md'
				>
					<Image
						alt='Track image'
						src={`${baseUrl.backend}/${playlist.image}${LARGE_IMAGE_ENDING}`}
						width={250}
						height={250}
						priority
						className='aspect-square rounded-md'
					></Image>
				</Link>
				{firstTrack && firstTrack.length ? (
					<PlayPlaylistButton
						track={firstTrack[0].track}
						playlistId={playlist.id}
						variant='card'
					/>
				) : null}
			</div>
			<div className='flex flex-col'>
				<Link
					href={`/${playlist.username}/playlists/${playlist.changeableId}`}
					className='max-w-full truncate'
				>
					{playlist.title}
				</Link>
				<p className='max-w-full truncate text-muted-foreground'>
					{playlist.createdAt.slice(0, 4)}
				</p>
			</div>
		</li>
	);
}

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
	const firstTrackQuery = useFirstPlaylistTrackQuery(playlist.id);
	const firstTrack = firstTrackQuery.data?.data;

	return (
		<li className='flex flex-col gap-2'>
			<div className='group relative rounded-md border'>
				<Link
					href={`/${playlist.username}/playlists/${playlist.changeableId}`}
					className='aspect-square rounded-md'
				>
					<Image
						alt='Track image'
						src={`${baseUrl.backend}/${playlist.image}${LARGE_IMAGE_ENDING}`}
						width={250}
						height={250}
						priority
						className='aspect-square rounded-md'
					></Image>
				</Link>
				{firstTrack && firstTrack.length ? (
					<PlayPlaylistButton
						track={firstTrack[0].track}
						playlistId={playlist.id}
						variant='card'
					/>
				) : null}
			</div>
			<div className='flex flex-col'>
				<Link
					href={`/${playlist.username}/playlists/${playlist.changeableId}`}
					className='max-w-full truncate'
				>
					{playlist.title}
				</Link>
				<Link
					href={`/${playlist.username}`}
					className='max-w-full truncate text-muted-foreground'
				>
					{playlist.username}
				</Link>
			</div>
		</li>
	);
}

export function AlbumCardProfile({ album }: { album: Album }) {
	const firstTrackQuery = useFirstAlbumTrackQuery(album.id);
	const firstTrack = firstTrackQuery.data?.data;

	return (
		<li className='flex flex-col gap-2'>
			<div className='group relative rounded-md border'>
				<Link
					href={`/${album.username}/albums/${album.changeableId}`}
					className='aspect-square rounded-md'
				>
					<Image
						alt='Track image'
						src={`${baseUrl.backend}/${album.image}${LARGE_IMAGE_ENDING}`}
						width={250}
						height={250}
						priority
						className='aspect-square rounded-md'
					></Image>
				</Link>
				{firstTrack && firstTrack.length ? (
					<PlayAlbumButton
						track={firstTrack[0].track}
						albumId={album.id}
						variant='card'
					/>
				) : null}
			</div>
			<div className='flex flex-col'>
				<Link
					href={`/${album.username}/albums/${album.changeableId}`}
					className='max-w-full truncate'
				>
					{album.title}
				</Link>
				<p className='max-w-full truncate text-muted-foreground'>
					{album.createdAt.slice(0, 4) + ' • ' + album.type.toUpperCase()}
				</p>
			</div>
		</li>
	);
}

export function AlbumCard({ album }: { album: Album }) {
	const firstTrackQuery = useFirstAlbumTrackQuery(album.id);
	const firstTrack = firstTrackQuery.data?.data;

	return (
		<li className='flex flex-col gap-2'>
			<div className='group relative rounded-md border'>
				<Link
					href={`/${album.username}/albums/${album.changeableId}`}
					className='aspect-square rounded-md'
				>
					<Image
						alt='Track image'
						src={`${baseUrl.backend}/${album.image}${LARGE_IMAGE_ENDING}`}
						width={250}
						height={250}
						priority
						className='aspect-square rounded-md'
					></Image>
				</Link>
				{firstTrack && firstTrack.length ? (
					<PlayAlbumButton
						track={firstTrack[0].track}
						albumId={album.id}
						variant='card'
					/>
				) : null}
			</div>
			<div className='flex flex-col'>
				<Link
					href={`/${album.username}/albums/${album.changeableId}`}
					className='max-w-full truncate'
				>
					{album.title}
				</Link>
				<Link
					href={`/${album.username}`}
					className='max-w-full truncate text-muted-foreground'
				>
					{album.username}
				</Link>
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
