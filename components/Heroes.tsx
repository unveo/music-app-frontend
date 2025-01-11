'use client';

import { Button } from '@/components/ui/button';
import { ACCEPTED_IMAGE_TYPES, baseUrl, LARGE_IMAGE_ENDING } from '@/config';
import { trackService } from '@/services/track/track.service';
import { useMutation } from '@tanstack/react-query';
import { Check, ImageUp, Pencil, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import {
	type UpdateTrackDto,
	UpdateTrackSchema
} from '@/services/track/track.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { formatDate, validateImage } from '@/lib/utils';
import { DeleteTrackButton } from '@/components/DeleteButtons';
import {
	type UpdatePlaylistDto,
	UpdatePlaylistSchema
} from '@/services/playlist/playlist.types';
import { playlistService } from '@/services/playlist/playlist.service';
import {
	useAlbumQuery,
	useCurrentUserQuery,
	usePlaylistQuery,
	useTrackQuery
} from '@/hooks/queries';
import { DeletePlaylistButton } from '@/components/DeleteButtons';
import { useToast } from '@/components/ui/use-toast';
import { UserPublic } from '@/services/user/user.types';
import {
	UpdateAlbumDto,
	UpdateAlbumSchema
} from '@/services/album/album.types';
import { albumService } from '@/services/album/album.service';
import { DeleteAlbumButton } from '@/components/DeleteButtons';

export function UserHero({ user }: { user: UserPublic }) {
	return (
		<div className='flex bg-skeleton p-6'>
			<div className='flex gap-4'>
				<div className='p-4'>
					<Image
						alt='Avatar'
						src={`${baseUrl.backend}/${user.image}${LARGE_IMAGE_ENDING}`}
						width={250}
						height={250}
						priority
						className='aspect-square size-52 cursor-pointer rounded-full border shadow-sm'
					></Image>
				</div>
				<div className='flex items-center'>
					<span className='text-2xl font-semibold'>{user.username}</span>
				</div>
			</div>
		</div>
	);
}

export function TrackHero({
	username,
	changeableId
}: {
	username: string;
	changeableId: string;
}) {
	const { toast } = useToast();

	const [editMode, setEditMode] = useState(false);
	const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const trackQuery = useTrackQuery(username, changeableId);
	const track = trackQuery.data?.data;

	const UpdateTrackForm = useForm<UpdateTrackDto>({
		resolver: zodResolver(UpdateTrackSchema),
		defaultValues: {
			title: '',
			image: undefined
		},
		disabled: !currentUser
	});

	const updateMutation = useMutation({
		mutationFn: (dto: FormData) =>
			trackService.update(track!.id, dto as unknown as UpdateTrackDto),
		onSuccess: () => {
			toast({ title: 'Track updated' });
			trackQuery.refetch();
			setEditMode(false);
		}
	});

	useEffect(() => {
		if (track) {
			setImageUrl(`${baseUrl.backend}/${track.image}${LARGE_IMAGE_ENDING}`);
			UpdateTrackForm.setValue('title', track.title);
		}
	}, [track]);

	useEffect(() => {
		if (UpdateTrackForm.formState.errors.title) {
			toast({
				title: UpdateTrackForm.formState.errors.title.message,
				variant: 'destructive'
			});
		}
	}, [UpdateTrackForm.formState.errors.title]);

	function onSubmit(dto: UpdateTrackDto) {
		if (!track) {
			return;
		}

		const formData = new FormData();

		if (!dto.image && (!dto.title || dto.title === track.title)) {
			toast({ title: "You haven't changed anything", variant: 'destructive' });
			return;
		}

		if (dto.title && dto.title !== track.title) {
			formData.append('title', dto.title);
		}
		if (dto.image) {
			formData.append('image', dto.image);
		}

		updateMutation.mutate(formData);
	}

	if (!track || !currentUser) {
		return null;
	}

	return (
		<div className='flex bg-skeleton p-6'>
			<form
				onSubmit={UpdateTrackForm.handleSubmit(onSubmit)}
				noValidate
				className='relative flex w-full gap-8 p-4'
			>
				{editMode ? (
					<div className='min-size-52 group relative size-52 rounded-md border'>
						<Controller
							name='image'
							control={UpdateTrackForm.control}
							render={({ field: { onChange, value, ...field } }) => (
								<>
									{imageUrl ? (
										<>
											<Button
												variant='outline'
												size='icon'
												type='button'
												className='absolute right-2 top-2 z-10 rounded-md opacity-0 transition-opacity group-hover:opacity-100'
												onClick={() => {
													setImageUrl(
														`${baseUrl.backend}/${track.image}${LARGE_IMAGE_ENDING}`
													);
													onChange(undefined);
												}}
											>
												<X className='size-5' />
											</Button>
											<Label
												htmlFor='image'
												className='absolute bottom-2 right-2 z-10 flex h-10 cursor-pointer items-center rounded-md border border-input bg-background px-4 py-2 opacity-0 transition-opacity hover:bg-accent hover:text-accent-foreground group-hover:opacity-100'
											>
												Edit
											</Label>
										</>
									) : (
										<Label
											htmlFor='image'
											className='flex size-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md bg-background p-6'
										>
											<ImageUp className='size-8'></ImageUp>
											<p>Click to upload image</p>
											<p className='text-xs'>JPG or PNG</p>
										</Label>
									)}
									<Input
										type='file'
										id='image'
										accept={`.jpg, .png, ${ACCEPTED_IMAGE_TYPES.join(', ')}`}
										onChange={(e) => {
											if (e.target.files?.[0]) {
												const file = e.target.files[0];
												try {
													validateImage(file);
												} catch (err: any) {
													toast({
														title: err.message,
														variant: 'destructive'
													});
													return;
												}
												const imageUrl = URL.createObjectURL(file);

												setImageUrl(imageUrl);
												onChange(file);
											}
										}}
										className='hidden'
										{...field}
									/>
									{imageUrl && (
										<Image
											src={imageUrl}
											alt='Image preview'
											className='absolute top-0 aspect-square size-full rounded-md object-cover'
											width={250}
											height={250}
										/>
									)}
								</>
							)}
						/>
					</div>
				) : (
					<div className='group relative size-52 cursor-pointer rounded-md border shadow-sm'>
						<Image
							alt='Cover'
							src={`${baseUrl.backend}/${track.image}${LARGE_IMAGE_ENDING}`}
							width={250}
							height={250}
							priority
							className='aspect-square size-full rounded-md'
						></Image>
					</div>
				)}
				<div className='flex flex-col justify-between py-2'>
					<span className='font-semibold'>Track</span>
					{editMode ? (
						<div className='flex h-10 items-center lg:w-[40rem]'>
							<Label htmlFor='title' className='hidden'>
								Title
							</Label>
							<Input
								id='title'
								placeholder='Title'
								required
								maxLength={20}
								{...UpdateTrackForm.register('title')}
								className='bg-transparent text-3xl font-semibold'
							/>
						</div>
					) : (
						<span className='text-3xl font-semibold'>{track.title}</span>
					)}
					<div className='flex h-4 gap-2'>
						<Link href={`/${track.username}`} className='font-semibold'>
							{track.username}
						</Link>
						{' • '}
						<span>{formatDate(track.createdAt)}</span>
					</div>
				</div>
				{track.userId === currentUser.id && (
					<div className='absolute right-4 flex flex-col gap-2'>
						<Button
							type='button'
							size='icon-lg'
							variant={editMode ? 'default' : 'outline'}
							disabled={!currentUser}
							onClick={() => {
								if (editMode) {
									setEditMode(false);
								} else {
									setEditMode(true);
								}
							}}
						>
							<Pencil className='size-5'></Pencil>
						</Button>
						{editMode && (
							<>
								<Button
									type='submit'
									size='icon-lg'
									variant='outline'
									disabled={!currentUser}
								>
									<Check className='size-5'></Check>
								</Button>
								<DeleteTrackButton
									trackId={track.id}
									username={username}
								></DeleteTrackButton>
							</>
						)}
					</div>
				)}
			</form>
		</div>
	);
}

export function PlaylistHero({
	username,
	changeableId
}: {
	username: string;
	changeableId: string;
}) {
	const { toast } = useToast();

	const [editMode, setEditMode] = useState(false);
	const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const playlistQuery = usePlaylistQuery(username, changeableId);
	const playlist = playlistQuery.data?.data;

	const UpdatePlaylistForm = useForm<UpdatePlaylistDto>({
		resolver: zodResolver(UpdatePlaylistSchema),
		defaultValues: {
			title: '',
			image: undefined
		},
		disabled: !currentUser
	});

	const updateMutation = useMutation({
		mutationFn: (dto: FormData) =>
			playlistService.update(playlist!.id, dto as unknown as UpdatePlaylistDto),
		onSuccess: () => {
			toast({ title: 'Playlist updated' });
			playlistQuery.refetch();
			setEditMode(false);
		}
	});

	useEffect(() => {
		if (playlist) {
			setImageUrl(`${baseUrl.backend}/${playlist.image}${LARGE_IMAGE_ENDING}`);
			UpdatePlaylistForm.setValue('title', playlist.title);
		}
	}, [playlist]);

	useEffect(() => {
		if (UpdatePlaylistForm.formState.errors.title) {
			toast({
				title: UpdatePlaylistForm.formState.errors.title.message,
				variant: 'destructive'
			});
		}
	}, [UpdatePlaylistForm.formState.errors.title]);

	function onSubmit(dto: UpdatePlaylistDto) {
		if (!playlist) {
			return;
		}

		const formData = new FormData();

		if (!dto.image && (!dto.title || dto.title === playlist.title)) {
			toast({ title: "You haven't changed anything", variant: 'destructive' });
			return;
		}

		if (dto.title && dto.title !== playlist.title) {
			formData.append('title', dto.title);
		}
		if (dto.image) {
			formData.append('image', dto.image);
		}

		updateMutation.mutate(formData);
	}

	if (!playlist || !currentUser) {
		return null;
	}

	return (
		<div className='flex bg-skeleton p-6'>
			<form
				onSubmit={UpdatePlaylistForm.handleSubmit(onSubmit)}
				noValidate
				className='relative flex w-full gap-8 p-4'
			>
				{editMode ? (
					<div className='min-size-52 group relative size-52 rounded-md border'>
						<Controller
							name='image'
							control={UpdatePlaylistForm.control}
							render={({ field: { onChange, value, ...field } }) => (
								<>
									{imageUrl ? (
										<>
											<Button
												variant='outline'
												size='icon'
												type='button'
												className='absolute right-2 top-2 z-10 rounded-md opacity-0 transition-opacity group-hover:opacity-100'
												onClick={() => {
													setImageUrl(
														`${baseUrl.backend}/${playlist.image}${LARGE_IMAGE_ENDING}`
													);
													onChange(undefined);
												}}
											>
												<X className='size-5' />
											</Button>
											<Label
												htmlFor='image'
												className='absolute bottom-2 right-2 z-10 flex h-10 cursor-pointer items-center rounded-md border border-input bg-background px-4 py-2 opacity-0 transition-opacity hover:bg-accent hover:text-accent-foreground group-hover:opacity-100'
											>
												Edit
											</Label>
										</>
									) : (
										<Label
											htmlFor='image'
											className='flex size-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md bg-background p-6'
										>
											<ImageUp className='size-8'></ImageUp>
											<span>Click to upload image</span>
											<span className='text-xs'>JPG or PNG</span>
										</Label>
									)}
									<Input
										type='file'
										id='image'
										accept={`.jpg, .png, ${ACCEPTED_IMAGE_TYPES.join(', ')}`}
										onChange={(e) => {
											if (e.target.files?.[0]) {
												const file = e.target.files[0];
												try {
													validateImage(file);
												} catch (err: any) {
													toast({
														title: err.message,
														variant: 'destructive'
													});
													return;
												}
												const imageUrl = URL.createObjectURL(file);
												setImageUrl(imageUrl);
												onChange(file);
											}
										}}
										className='hidden'
										{...field}
									/>
									{imageUrl && (
										<Image
											src={imageUrl}
											alt='Image preview'
											className='absolute top-0 aspect-square size-full rounded-md object-cover'
											width={250}
											height={250}
										/>
									)}
								</>
							)}
						/>
					</div>
				) : (
					<div className='group relative size-52 cursor-pointer rounded-md border shadow-sm'>
						<Image
							alt='Cover'
							src={`${baseUrl.backend}/${playlist.image}${LARGE_IMAGE_ENDING}`}
							width={250}
							height={250}
							priority
							className='aspect-square size-full rounded-md'
						></Image>
					</div>
				)}
				<div className='flex flex-col justify-between py-2'>
					<span className='font-semibold'>Playlist</span>
					{editMode ? (
						<div className='flex h-10 items-center lg:w-[40rem]'>
							<Label htmlFor='title' className='hidden'>
								Title
							</Label>
							<Input
								id='title'
								placeholder='Title'
								required
								maxLength={20}
								{...UpdatePlaylistForm.register('title')}
								className='bg-transparent text-3xl font-semibold'
							/>
						</div>
					) : (
						<span className='text-3xl font-semibold'>{playlist.title}</span>
					)}
					<div className='flex h-4 gap-2'>
						<Link href={`/${playlist.username}`} className='font-semibold'>
							{playlist.username}
						</Link>
						{' • '}
						<span>{formatDate(playlist.createdAt)}</span>
						{' • '}
						<span>{`${playlist._count.tracks} ${playlist._count.tracks === 1 ? 'song' : 'songs'}`}</span>
					</div>
				</div>
				{playlist.userId === currentUser.id && (
					<div className='absolute right-4 flex flex-col gap-2'>
						<Button
							type='button'
							size='icon-lg'
							variant={editMode ? 'default' : 'outline'}
							disabled={!currentUser}
							onClick={() => {
								if (editMode) {
									setEditMode(false);
								} else {
									setEditMode(true);
								}
							}}
						>
							<Pencil className='size-5'></Pencil>
						</Button>
						{editMode && (
							<>
								<Button
									type='submit'
									size='icon-lg'
									variant='outline'
									disabled={!currentUser}
								>
									<Check className='size-5'></Check>
								</Button>
								<DeletePlaylistButton
									playlistId={playlist.id}
									username={username}
								></DeletePlaylistButton>
							</>
						)}
					</div>
				)}
			</form>
		</div>
	);
}

export function AlbumHero({
	username,
	changeableId
}: {
	username: string;
	changeableId: string;
}) {
	const { toast } = useToast();

	const [editMode, setEditMode] = useState(false);
	const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const albumQuery = useAlbumQuery(username, changeableId);
	const album = albumQuery.data?.data;

	const UpdateAlbumForm = useForm<UpdateAlbumDto>({
		resolver: zodResolver(UpdateAlbumSchema),
		defaultValues: {
			title: '',
			image: undefined
		},
		disabled: !currentUser
	});

	const updateMutation = useMutation({
		mutationFn: (dto: FormData) =>
			albumService.update(album!.id, dto as unknown as UpdateAlbumDto),
		onSuccess: () => {
			toast({ title: 'Album updated' });
			albumQuery.refetch();
			setEditMode(false);
		}
	});

	useEffect(() => {
		if (album) {
			setImageUrl(`${baseUrl.backend}/${album.image}${LARGE_IMAGE_ENDING}`);
			UpdateAlbumForm.setValue('title', album.title);
		}
	}, [album]);

	useEffect(() => {
		if (UpdateAlbumForm.formState.errors.title) {
			toast({
				title: UpdateAlbumForm.formState.errors.title.message,
				variant: 'destructive'
			});
		}
	}, [UpdateAlbumForm.formState.errors.title]);

	function onSubmit(dto: UpdateAlbumDto) {
		if (!album) {
			return;
		}

		const formData = new FormData();

		if (!dto.image && (!dto.title || dto.title === album.title)) {
			toast({ title: "You haven't changed anything", variant: 'destructive' });
			return;
		}

		if (dto.title && dto.title !== album.title) {
			formData.append('title', dto.title);
		}
		if (dto.image) {
			formData.append('image', dto.image);
		}

		updateMutation.mutate(formData);
	}

	if (!album || !currentUser) {
		return null;
	}

	return (
		<div className='flex bg-skeleton p-6'>
			<form
				onSubmit={UpdateAlbumForm.handleSubmit(onSubmit)}
				noValidate
				className='relative flex w-full gap-8 p-4'
			>
				{editMode ? (
					<div className='min-size-52 group relative size-52 rounded-md border'>
						<Controller
							name='image'
							control={UpdateAlbumForm.control}
							render={({ field: { onChange, value, ...field } }) => (
								<>
									{imageUrl ? (
										<>
											<Button
												variant='outline'
												size='icon'
												type='button'
												className='absolute right-2 top-2 z-10 rounded-md opacity-0 transition-opacity group-hover:opacity-100'
												onClick={() => {
													setImageUrl(
														`${baseUrl.backend}/${album.image}${LARGE_IMAGE_ENDING}`
													);
													onChange(undefined);
												}}
											>
												<X className='size-5' />
											</Button>
											<Label
												htmlFor='image'
												className='absolute bottom-2 right-2 z-10 flex h-10 cursor-pointer items-center rounded-md border border-input bg-background px-4 py-2 opacity-0 transition-opacity hover:bg-accent hover:text-accent-foreground group-hover:opacity-100'
											>
												Edit
											</Label>
										</>
									) : (
										<Label
											htmlFor='image'
											className='flex size-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md bg-background p-6'
										>
											<ImageUp className='size-8'></ImageUp>
											<span>Click to upload image</span>
											<span className='text-xs'>JPG or PNG</span>
										</Label>
									)}
									<Input
										type='file'
										id='image'
										accept={`.jpg, .png, ${ACCEPTED_IMAGE_TYPES.join(', ')}`}
										onChange={(e) => {
											if (e.target.files?.[0]) {
												const file = e.target.files[0];
												try {
													validateImage(file);
												} catch (err: any) {
													toast({
														title: err.message,
														variant: 'destructive'
													});
													return;
												}
												const imageUrl = URL.createObjectURL(file);
												setImageUrl(imageUrl);
												onChange(file);
											}
										}}
										className='hidden'
										{...field}
									/>
									{imageUrl && (
										<Image
											src={imageUrl}
											alt='Image preview'
											className='absolute top-0 aspect-square size-full rounded-md object-cover'
											width={250}
											height={250}
										/>
									)}
								</>
							)}
						/>
					</div>
				) : (
					<div className='group relative size-52 cursor-pointer rounded-md border shadow-sm'>
						<Image
							alt='Cover'
							src={`${baseUrl.backend}/${album.image}${LARGE_IMAGE_ENDING}`}
							width={250}
							height={250}
							priority
							className='aspect-square size-full rounded-md'
						></Image>
					</div>
				)}
				<div className='flex flex-col justify-between py-2'>
					<span className='font-semibold'>Album</span>
					{editMode ? (
						<div className='flex h-10 items-center lg:w-[40rem]'>
							<Label htmlFor='title' className='hidden'>
								Title
							</Label>
							<Input
								id='title'
								placeholder='Title'
								required
								maxLength={20}
								{...UpdateAlbumForm.register('title')}
								className='bg-transparent text-3xl font-semibold'
							/>
						</div>
					) : (
						<span className='text-3xl font-semibold'>{album.title}</span>
					)}
					<div className='flex h-4 gap-2'>
						<Link href={`/${album.username}`} className='font-semibold'>
							{album.username}
						</Link>
						{' • '}
						<span>{formatDate(album.createdAt)}</span>
						{' • '}
						<span>{`${album._count.tracks} ${album._count.tracks === 1 ? 'song' : 'songs'}`}</span>
					</div>
				</div>
				{album.userId === currentUser.id && (
					<div className='absolute right-4 flex flex-col gap-2'>
						<Button
							type='button'
							size='icon-lg'
							variant={editMode ? 'default' : 'outline'}
							disabled={!currentUser}
							onClick={() => {
								if (editMode) {
									setEditMode(false);
								} else {
									setEditMode(true);
								}
							}}
						>
							<Pencil className='size-5'></Pencil>
						</Button>
						{editMode && (
							<>
								<Button
									type='submit'
									size='icon-lg'
									variant='outline'
									disabled={!currentUser}
								>
									<Check className='size-5'></Check>
								</Button>
								<DeleteAlbumButton
									albumId={album.id}
									username={username}
								></DeleteAlbumButton>
							</>
						)}
					</div>
				)}
			</form>
		</div>
	);
}
