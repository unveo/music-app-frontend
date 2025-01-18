'use client';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { TableCell, TableRow } from './ui/table';
import { useTrackStore } from '@/stores/track.store';
import { useTrackLocalStore } from '@/stores/track-local.store';
import { TrackInPlaylist } from '@/services/playlist/playlist-track/playlist-track.types';
import { formatTime, nFormatter } from '@/lib/utils';
import { PlayAlbumTrackButton, PlayPlaylistTrackButton } from './PlayButtons';
import { useQueueStore } from '@/stores/queue.store';
import { LikeTrackButton } from './LikeButtons';
import { RemoveFromPlaylistButton } from './RemoveButtons';
import Image from 'next/image';
import { IMAGES_URL, SMALL_IMAGE_ENDING } from '@/config';
import Link from 'next/link';
import { TrackInAlbum } from '@/services/album/album-track/album-track.types';
import { DeleteAlbumTrackButton } from './DeleteButtons';

export function PlaylistRow({
	playlistTrack,
	playlistId
}: {
	playlistTrack: TrackInPlaylist;
	playlistId: number;
}) {
	const { isPlaying } = useTrackStore();
	const { trackId } = useTrackLocalStore();
	const { type, queueId } = useQueueStore();

	return (
		<TableRow className='group cursor-default'>
			<TableCell className='relative'>
				<span
					className={`${
						trackId === playlistTrack.track.id &&
						type === 'playlist' &&
						queueId === playlistId
							? isPlaying
								? 'opacity-0'
								: 'text-primary'
							: ''
					} group-hover:opacity-0`}
				>
					{playlistTrack.position}
				</span>
				<PlayPlaylistTrackButton
					track={playlistTrack.track}
					playlistId={playlistId}
					position={playlistTrack.position}
				></PlayPlaylistTrackButton>
			</TableCell>
			<TableCell>
				<div className='flex h-10 items-center gap-3'>
					<Image
						alt='cover'
						src={`${IMAGES_URL}/${playlistTrack.track.image}${SMALL_IMAGE_ENDING}`}
						width={50}
						height={50}
						className='aspect-square size-10 rounded-md border'
					/>
					<div>
						<p
							className={
								trackId === playlistTrack.track.id &&
								type === 'playlist' &&
								queueId === playlistId
									? 'text-primary'
									: ''
							}
						>
							{playlistTrack.track.title}
						</p>
						<Link
							href={`/${playlistTrack.track.username}`}
							className='text-muted-foreground'
						>
							{playlistTrack.track.username}
						</Link>
					</div>
				</div>
			</TableCell>
			<TableCell>{playlistTrack.addedAt.slice(0, 7)}</TableCell>
			<TableCell className='text-right'>
				<div className='flex items-center justify-end gap-2'>
					<div className='flex gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
						<LikeTrackButton
							username={playlistTrack.track.username}
							changeableId={playlistTrack.track.changeableId}
							inTable
						></LikeTrackButton>
					</div>
					<p>{formatTime(playlistTrack.track.duration)}</p>
				</div>
			</TableCell>
		</TableRow>
	);
}

export function PlaylistSortableRow({
	id,
	playlistTrack,
	playlistId,
	changeableId
}: {
	id: number;
	playlistTrack: TrackInPlaylist;
	playlistId: number;
	changeableId: string;
}) {
	const { isPlaying } = useTrackStore();
	const { trackId } = useTrackLocalStore();
	const { type, queueId } = useQueueStore();

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	return (
		<TableRow
			ref={setNodeRef}
			style={style}
			className='group cursor-default'
			{...attributes}
			{...listeners}
		>
			<TableCell className='relative'>
				<span
					className={`${
						trackId === playlistTrack.track.id &&
						type === 'playlist' &&
						queueId === playlistId
							? isPlaying
								? 'opacity-0'
								: 'text-primary'
							: ''
					} group-hover:opacity-0`}
				>
					{playlistTrack.position}
				</span>
				<PlayPlaylistTrackButton
					track={playlistTrack.track}
					playlistId={playlistId}
					position={playlistTrack.position}
				></PlayPlaylistTrackButton>
			</TableCell>
			<TableCell>
				<div className='flex h-10 items-center gap-3'>
					<Image
						alt='cover'
						src={`${IMAGES_URL}/${playlistTrack.track.image}${SMALL_IMAGE_ENDING}`}
						width={50}
						height={50}
						className='aspect-square size-10 rounded-md border'
					/>
					<div>
						<p
							className={
								trackId === playlistTrack.track.id &&
								type === 'playlist' &&
								queueId === playlistId
									? 'text-primary'
									: ''
							}
						>
							{playlistTrack.track.title}
						</p>
						<Link
							href={`/${playlistTrack.track.username}`}
							className='text-muted-foreground'
						>
							{playlistTrack.track.username}
						</Link>
					</div>
				</div>
			</TableCell>
			<TableCell>{playlistTrack.addedAt.slice(0, 7)}</TableCell>
			<TableCell className='text-right'>
				<div className='flex items-center justify-end gap-2'>
					<div className='flex gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
						<LikeTrackButton
							username={playlistTrack.track.username}
							changeableId={playlistTrack.track.changeableId}
							inTable
						></LikeTrackButton>
						<RemoveFromPlaylistButton
							changeableId={changeableId}
							playlistId={playlistId}
							trackToRemoveId={playlistTrack.track.id}
						></RemoveFromPlaylistButton>
					</div>
					<p>{formatTime(playlistTrack.track.duration)}</p>
				</div>
			</TableCell>
		</TableRow>
	);
}

export function AlbumRow({
	albumTrack,
	albumId
}: {
	albumTrack: TrackInAlbum;
	albumId: number;
}) {
	const { isPlaying } = useTrackStore();
	const { trackId } = useTrackLocalStore();
	const { type, queueId } = useQueueStore();

	return (
		<TableRow className='group cursor-default'>
			<TableCell className='relative'>
				<span
					className={`${
						trackId === albumTrack.track.id &&
						type === 'album' &&
						queueId === albumId
							? isPlaying
								? 'opacity-0'
								: 'text-primary'
							: ''
					} group-hover:opacity-0`}
				>
					{albumTrack.position}
				</span>
				<PlayAlbumTrackButton
					track={albumTrack.track}
					albumId={albumId}
					position={albumTrack.position}
				></PlayAlbumTrackButton>
			</TableCell>
			<TableCell>
				<div className='flex h-10 items-center gap-3'>
					<div>
						<p
							className={
								trackId === albumTrack.track.id &&
								type === 'album' &&
								queueId === albumId
									? 'text-primary'
									: ''
							}
						>
							{albumTrack.track.title}
						</p>
						<Link
							href={`/${albumTrack.track.username}`}
							className='text-muted-foreground'
						>
							{albumTrack.track.username}
						</Link>
					</div>
				</div>
			</TableCell>
			<TableCell className='text-right'>
				{nFormatter(albumTrack.track.plays)}
			</TableCell>
			<TableCell className='text-right'>
				<div className='flex items-center justify-end gap-2'>
					<div className='flex gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
						<LikeTrackButton
							username={albumTrack.track.username}
							changeableId={albumTrack.track.changeableId}
							inTable
						></LikeTrackButton>
					</div>
					<p>{formatTime(albumTrack.track.duration)}</p>
				</div>
			</TableCell>
		</TableRow>
	);
}

export function AlbumSortableRow({
	id,
	albumTrack,
	albumId,
	changeableId
}: {
	id: number;
	albumTrack: TrackInAlbum;
	albumId: number;
	changeableId: string;
}) {
	const { isPlaying } = useTrackStore();
	const { trackId } = useTrackLocalStore();
	const { type, queueId } = useQueueStore();

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	return (
		<TableRow
			ref={setNodeRef}
			style={style}
			className='group cursor-default'
			{...attributes}
			{...listeners}
		>
			<TableCell className='relative'>
				<span
					className={`${
						trackId === albumTrack.track.id &&
						type === 'album' &&
						queueId === albumId
							? isPlaying
								? 'opacity-0'
								: 'text-primary'
							: ''
					} group-hover:opacity-0`}
				>
					{albumTrack.position}
				</span>
				<PlayAlbumTrackButton
					track={albumTrack.track}
					albumId={albumId}
					position={albumTrack.position}
				></PlayAlbumTrackButton>
			</TableCell>
			<TableCell>
				<div className='flex h-10 items-center gap-3'>
					<div>
						<p
							className={
								trackId === albumTrack.track.id &&
								type === 'album' &&
								queueId === albumId
									? 'text-primary'
									: ''
							}
						>
							{albumTrack.track.title}
						</p>
						<Link
							href={`/${albumTrack.track.username}`}
							className='text-muted-foreground'
						>
							{albumTrack.track.username}
						</Link>
					</div>
				</div>
			</TableCell>
			<TableCell className='text-right'>
				{nFormatter(albumTrack.track.plays)}
			</TableCell>
			<TableCell className='text-right'>
				<div className='flex items-center justify-end gap-2'>
					<div className='flex gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
						<LikeTrackButton
							username={albumTrack.track.username}
							changeableId={albumTrack.track.changeableId}
							inTable
						></LikeTrackButton>
						<DeleteAlbumTrackButton
							changeableId={changeableId}
							albumId={albumId}
							trackToDeleteId={albumTrack.track.id}
						></DeleteAlbumTrackButton>
					</div>
					<p>{formatTime(albumTrack.track.duration)}</p>
				</div>
			</TableCell>
		</TableRow>
	);
}

export function UploadAlbumSortableRow({
	id,
	index,
	children
}: {
	id: string;
	index: number;
	children: React.ReactNode;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	return (
		<TableRow ref={setNodeRef} style={style} className='group'>
			<TableCell
				className='relative cursor-grab active:cursor-grabbing'
				{...attributes}
				{...listeners}
			>
				{index + 1}
			</TableCell>
			{children}
		</TableRow>
	);
}
