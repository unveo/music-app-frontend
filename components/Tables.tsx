'use client';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { PlayUserTrackButton } from './PlayButtons';
import { LikeTrackButton } from './LikeButtons';
import AddToPlaylistMenu from './AddToPlaylistMenu';
import { formatTime, nFormatter, validateAudio } from '@/lib/utils';
import {
	useAlbumQuery,
	useAlbumTracksQuery,
	usePlaylistQuery,
	usePlaylistTracksQuery,
	useTrackQuery
} from '@/hooks/queries';
import { useTrackStore } from '@/stores/track.store';
import { useTrackLocalStore } from '@/stores/track-local.store';
import {
	type DragEndEvent,
	DndContext,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors
} from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
	restrictToParentElement,
	restrictToVerticalAxis
} from '@dnd-kit/modifiers';
import {
	PlaylistSortableRow,
	AlbumSortableRow,
	UploadAlbumSortableRow,
	AlbumRow,
	PlaylistRow
} from '@/components/TableRows';
import {
	Controller,
	UseFieldArrayReturn,
	UseFormReturn
} from 'react-hook-form';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { ACCEPTED_AUDIO_TYPES } from '@/config';
import { useToast } from './ui/use-toast';
import { UpdateTrackPositionDto } from '@/services/playlist/playlist-track/playlist-track.types';
import { useMutation } from '@tanstack/react-query';
import { playlistTrackService } from '@/services/playlist/playlist-track/playlist-track.service';
import { useQueueStore } from '@/stores/queue.store';
import Link from 'next/link';
import { albumTrackService } from '@/services/album/album-track/album-track.service';

export function TrackTable({
	username,
	changeableId
}: {
	username: string;
	changeableId: string;
}) {
	const { isPlaying } = useTrackStore();
	const { trackId } = useTrackLocalStore();
	const { type, queueId } = useQueueStore();

	const trackQuery = useTrackQuery(username, changeableId);
	const track = trackQuery.data?.data;

	if (!track) {
		return null;
	}

	return (
		<Table className='mb-4'>
			<TableHeader>
				<TableRow>
					<TableHead className='w-0'>#</TableHead>
					<TableHead className='w-96'>Title</TableHead>
					<TableHead className='w-80 text-right'>Plays</TableHead>
					<TableHead>
						<div className='flex justify-end gap-2'>
							<span className='w-10'></span>
							<p>Time</p>
						</div>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow className='group'>
					<TableCell className='relative'>
						<span
							className={`${
								trackId === track.id &&
								type === 'user' &&
								queueId === track.userId
									? isPlaying
										? 'opacity-0'
										: 'text-primary'
									: ''
							} group-hover:opacity-0`}
						>
							1
						</span>
						<PlayUserTrackButton
							track={track}
							variant='table'
						></PlayUserTrackButton>
					</TableCell>
					<TableCell className='cursor-default'>
						<div className='flex h-10 max-w-28 items-center gap-3 truncate sm:max-w-full'>
							<div className='truncate'>
								<p
									className={
										trackId === track.id &&
										type === 'user' &&
										queueId === track.userId
											? 'truncate text-primary'
											: 'truncate'
									}
								>
									{track.title}
								</p>
								<Link
									href={`/${track.username}`}
									className='text-muted-foreground'
								>
									{track.username}
								</Link>
							</div>
						</div>
					</TableCell>
					<TableCell className='cursor-default text-right'>
						{nFormatter(track.plays)}
					</TableCell>
					<TableCell className='text-right'>
						<div className='flex items-center justify-end gap-2'>
							<div className='flex gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
								<LikeTrackButton
									username={username}
									changeableId={changeableId}
									inTable
								></LikeTrackButton>
								<AddToPlaylistMenu
									trackToAddId={track.id}
									inTable
								></AddToPlaylistMenu>
							</div>
							<p className='cursor-default'>{formatTime(track.duration)}</p>
						</div>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
}

export function PlaylistTable({
	username,
	changeableId
}: {
	username: string;
	changeableId: string;
}) {
	const playlistQuery = usePlaylistQuery(username, changeableId);
	const playlist = playlistQuery.data?.data;

	const playlistTracksQuery = usePlaylistTracksQuery(
		changeableId,
		playlist?.id
	);
	const playlistTracks = playlistTracksQuery.data?.data;

	if (!playlist) {
		return null;
	}

	if (playlistTracksQuery.isLoading) {
		return null;
	}

	if (!playlistTracks?.length) {
		return (
			<div className='flex h-60 w-full items-center justify-center text-2xl'>
				This playlist doesn&apos;t have any tracks
			</div>
		);
	}

	return (
		<Table className='mb-4'>
			<TableHeader>
				<TableRow>
					<TableHead className='w-0'>#</TableHead>
					<TableHead className='w-[32rem]'>Title</TableHead>
					<TableHead className='w-[32rem]'>Date added</TableHead>
					<TableHead>
						<div className='flex justify-end gap-2'>
							<span className='w-4'></span>
							<p>Time</p>
						</div>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{playlistTracks.map((playlistTrack) => (
					<PlaylistRow
						key={playlistTrack.track.id}
						playlistId={playlist.id}
						playlistTrack={playlistTrack}
					></PlaylistRow>
				))}
			</TableBody>
		</Table>
	);
}

export function PlaylistSortableTable({
	username,
	changeableId
}: {
	username: string;
	changeableId: string;
}) {
	const { trackId } = useTrackLocalStore();
	const { type, queueId, setPrev, setNext } = useQueueStore();

	const playlistQuery = usePlaylistQuery(username, changeableId);
	const playlist = playlistQuery.data?.data;

	const playlistTracksQuery = usePlaylistTracksQuery(
		changeableId,
		playlist?.id
	);
	const playlistTracks = playlistTracksQuery.data?.data;

	const updatePositionMutation = useMutation({
		mutationFn: (data: {
			playlistId: number;
			trackId: number;
			dto: UpdateTrackPositionDto;
		}) =>
			playlistTrackService.updateTrackPosition(
				data.playlistId,
				data.trackId,
				data.dto
			),
		onSuccess: async () => {
			const playlistTracksQuery2 = await playlistTracksQuery.refetch();
			const playlistTracks = playlistTracksQuery2.data?.data;

			if (!playlistTracks) {
				return;
			}

			if (playlist && type === 'playlist' && queueId === playlist.id) {
				const relation = playlistTracks.find(
					(relation) => relation.track.id === trackId
				);

				if (!relation) {
					return;
				}

				const tracksIds = await playlistTrackService.getManyIds(
					playlist.id,
					relation.position
				);

				setPrev(tracksIds.data.prevIds);
				setNext(tracksIds.data.nextIds);
			}
		}
	});

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 10
			}
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		if (!playlist || !playlistTracks) {
			return;
		}

		const { active, over } = event;

		if (active.id !== over?.id) {
			const newIndex = playlistTracks.findIndex(
				(relation) => relation.track.id === over?.id
			);

			updatePositionMutation.mutate({
				playlistId: playlist.id,
				trackId: active.id as number,
				dto: { position: newIndex + 1 }
			});
		}
	};

	if (!playlist) {
		return null;
	}

	if (playlistTracksQuery.isLoading) {
		return null;
	}

	if (!playlistTracks?.length) {
		return (
			<div className='flex h-60 w-full items-center justify-center text-2xl'>
				This playlist doesn&apos;t have any tracks
			</div>
		);
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			modifiers={[restrictToVerticalAxis, restrictToParentElement]}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={playlistTracks.map((relation) => relation.track.id)}
				strategy={verticalListSortingStrategy}
			>
				<Table className='mb-4'>
					<TableHeader>
						<TableRow>
							<TableHead className='w-0'>#</TableHead>
							<TableHead className='w-[32rem]'>Title</TableHead>
							<TableHead className='w-[32rem]'>Date added</TableHead>
							<TableHead>
								<div className='flex justify-end gap-2'>
									<span className='w-10'></span>
									<p>Time</p>
								</div>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{playlistTracks.map((playlistTrack) => (
							<PlaylistSortableRow
								key={playlistTrack.track.id}
								id={playlistTrack.track.id}
								playlistId={playlist.id}
								changeableId={changeableId}
								playlistTrack={playlistTrack}
							></PlaylistSortableRow>
						))}
					</TableBody>
				</Table>
			</SortableContext>
		</DndContext>
	);
}

export function AlbumTable({
	username,
	changeableId
}: {
	username: string;
	changeableId: string;
}) {
	const albumQuery = useAlbumQuery(username, changeableId);
	const album = albumQuery.data?.data;

	const albumTracksQuery = useAlbumTracksQuery(changeableId, album?.id);
	const albumTracks = albumTracksQuery.data?.data;

	if (!album) {
		return null;
	}

	if (albumTracksQuery.isLoading) {
		return null;
	}

	if (!albumTracks?.length) {
		return (
			<div className='flex h-60 w-full items-center justify-center text-2xl'>
				This album doesn&apos;t have any tracks
			</div>
		);
	}

	return (
		<Table className='mb-4'>
			<TableHeader>
				<TableRow>
					<TableHead className='w-0'>#</TableHead>
					<TableHead className='w-96'>Title</TableHead>
					<TableHead className='w-80 text-right'>Plays</TableHead>
					<TableHead>
						<div className='flex justify-end gap-2'>
							<span className='w-4'></span>
							<p>Time</p>
						</div>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{albumTracks.map((albumTrack) => (
					<AlbumRow
						key={albumTrack.track.id}
						albumId={album.id}
						albumTrack={albumTrack}
					></AlbumRow>
				))}
			</TableBody>
		</Table>
	);
}

export function AlbumSortableTable({
	username,
	changeableId
}: {
	username: string;
	changeableId: string;
}) {
	const { trackId } = useTrackLocalStore();
	const { type, queueId, setPrev, setNext } = useQueueStore();

	const albumQuery = useAlbumQuery(username, changeableId);
	const album = albumQuery.data?.data;

	const albumTracksQuery = useAlbumTracksQuery(changeableId, album?.id);
	const albumTracks = albumTracksQuery.data?.data;

	const updatePositionMutation = useMutation({
		mutationFn: (data: {
			albumId: number;
			trackId: number;
			dto: UpdateTrackPositionDto;
		}) =>
			albumTrackService.updateTrackPosition(
				data.albumId,
				data.trackId,
				data.dto
			),
		onSuccess: async () => {
			const albumTracksQuery2 = await albumTracksQuery.refetch();
			const albumTracks = albumTracksQuery2.data?.data;

			if (!albumTracks) {
				return;
			}

			if (album && type === 'album' && queueId === album.id) {
				const relation = albumTracks.find(
					(relation) => relation.track.id === trackId
				);

				if (!relation) {
					return;
				}

				const tracksIds = await albumTrackService.getManyIds(
					album.id,
					relation.position
				);

				setPrev(tracksIds.data.prevIds);
				setNext(tracksIds.data.nextIds);
			}
		}
	});

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 10
			}
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		if (!album || !albumTracks) {
			return;
		}

		const { active, over } = event;

		if (active.id !== over?.id) {
			const newIndex = albumTracks.findIndex(
				(relation) => relation.track.id === over?.id
			);

			updatePositionMutation.mutate({
				albumId: album.id,
				trackId: active.id as number,
				dto: { position: newIndex + 1 }
			});
		}
	};

	if (!album) {
		return null;
	}

	if (albumTracksQuery.isLoading) {
		return null;
	}

	if (!albumTracks?.length) {
		return (
			<div className='flex h-60 w-full items-center justify-center text-2xl'>
				This album doesn&apos;t have any tracks
			</div>
		);
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			modifiers={[restrictToVerticalAxis, restrictToParentElement]}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={albumTracks.map((relation) => relation.track.id)}
				strategy={verticalListSortingStrategy}
			>
				<Table className='mb-4'>
					<TableHeader>
						<TableRow>
							<TableHead className='w-0'>#</TableHead>
							<TableHead className='w-96'>Title</TableHead>
							<TableHead className='w-80 text-right'>Plays</TableHead>
							<TableHead>
								<div className='flex justify-end gap-2'>
									<span className='w-10'></span>
									<p>Time</p>
								</div>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{albumTracks.map((albumTrack) => (
							<AlbumSortableRow
								key={albumTrack.track.id}
								id={albumTrack.track.id}
								albumId={album.id}
								changeableId={changeableId}
								albumTrack={albumTrack}
							></AlbumSortableRow>
						))}
					</TableBody>
				</Table>
			</SortableContext>
		</DndContext>
	);
}

export function UploadAlbumTable({
	tracksField,
	createAlbumForm
}: {
	tracksField: UseFieldArrayReturn<
		{
			title: string;
			image: File;
			changeableId: string;
			type: 'lp' | 'ep';
			tracks: {
				title: string;
				changeableId: string;
				audio?: File | undefined;
			}[];
		},
		'tracks',
		'id'
	>;
	createAlbumForm: UseFormReturn<
		{
			title: string;
			image: File;
			type: 'lp' | 'ep';
			changeableId: string;
			tracks: {
				title: string;
				changeableId: string;
				audio?: File | undefined;
			}[];
		},
		any,
		undefined
	>;
}) {
	const { toast } = useToast();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 10
			}
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (active.id !== over?.id) {
			const oldIndex = tracksField.fields.findIndex(
				(item) => item.id === active.id
			);
			const newIndex = tracksField.fields.findIndex(
				(item) => item.id === over?.id
			);

			tracksField.move(oldIndex, newIndex);
		}
	};

	if (!tracksField.fields.length) {
		return null;
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			modifiers={[restrictToVerticalAxis, restrictToParentElement]}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={tracksField.fields.map((field) => field.id)}
				strategy={verticalListSortingStrategy}
			>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='w-0 px-1 sm:px-4'>#</TableHead>
							<TableHead className='px-1 sm:px-4'>Title</TableHead>
							<TableHead className='px-1 sm:px-4'>Id</TableHead>
							<TableHead className='px-1 text-center sm:px-4'>Audio</TableHead>
							<TableHead className='px-1 text-right sm:px-4'>Remove</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tracksField.fields.map((field, index) => (
							<UploadAlbumSortableRow
								key={field.id}
								id={field.id}
								index={index}
							>
								<TableCell className='px-1 sm:px-4'>
									<Label htmlFor={`tracks.${index}.title`} className='hidden'>
										Track Title
									</Label>
									<Input
										placeholder='Title'
										required
										maxLength={20}
										id={`tracks.${index}.title`}
										{...createAlbumForm.register(`tracks.${index}.title`)}
										className='bg-transparent'
									/>
								</TableCell>
								<TableCell className='px-1 sm:px-4'>
									<Label
										htmlFor={`tracks.${index}.changeableId`}
										className='hidden'
									>
										Track Id
									</Label>
									<Input
										placeholder='Track id'
										required
										maxLength={20}
										id={`tracks.${index}.changeableId`}
										{...createAlbumForm.register(
											`tracks.${index}.changeableId`
										)}
										className='bg-transparent'
									/>
								</TableCell>
								<TableCell className='px-1 py-0 sm:px-4'>
									<Controller
										name={`tracks.${index}.audio`}
										control={createAlbumForm.control}
										render={({ field: { onChange, value, ...field } }) => (
											<div className='group/clear relative flex justify-end'>
												{value ? (
													<>
														<Button
															variant='outline'
															size='icon-sm'
															type='button'
															className='absolute right-2 z-10 translate-y-1/2 rounded-md opacity-0 transition-opacity group-hover/clear:opacity-100'
															onClick={() => {
																onChange(undefined);
															}}
														>
															<X className='size-5' />
														</Button>
														<Label
															htmlFor={`tracks.${index}.audio`}
															className='flex h-10 w-14 cursor-pointer items-center justify-center rounded-md border px-4 md:w-44'
														>
															<p className='flex h-full items-center justify-center overflow-hidden text-nowrap'>
																{value.name}
															</p>
														</Label>
													</>
												) : (
													<Label
														htmlFor={`tracks.${index}.audio`}
														className='flex h-10 w-14 cursor-pointer items-center justify-center rounded-md border px-4 md:w-44'
													>
														Upload audio
													</Label>
												)}
												<Input
													type='file'
													id={`tracks.${index}.audio`}
													className='hidden'
													accept={`.mp3, .aac, .flac, .wav, .aiff, .webm, ${ACCEPTED_AUDIO_TYPES.join(', ')}`}
													onChange={(e) => {
														const file = e.target.files?.[0];

														if (file) {
															try {
																validateAudio(file);
															} catch (err: any) {
																toast({
																	title: err.message,
																	variant: 'destructive'
																});
																return;
															}

															onChange(file);
														}
													}}
													{...field}
												/>
											</div>
										)}
									/>
								</TableCell>
								<TableCell className='px-1 sm:px-4'>
									<div className='flex h-10 items-center justify-end'>
										<Button
											type='button'
											variant='destructive'
											size='icon'
											onClick={() => tracksField.remove(index)}
										>
											<X className='size-5'></X>
										</Button>
									</div>
								</TableCell>
							</UploadAlbumSortableRow>
						))}
					</TableBody>
				</Table>
			</SortableContext>
		</DndContext>
	);
}
