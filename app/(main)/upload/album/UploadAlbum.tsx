'use client';

import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { ImageUp, X } from 'lucide-react';
import { validateImage } from '@/lib/utils';
import { ACCEPTED_IMAGE_TYPES } from '@/config';
import {
	type CreateAlbumDto,
	CreateAlbumSchema
} from '@/services/album/album.types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { albumService } from '@/services/album/album.service';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useCurrentUserQuery } from '@/hooks/queries';
import { UploadAlbumTable } from '@/components/Tables';

export default function UploadAlbum() {
	const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

	const { toast } = useToast();

	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const createAlbumForm = useForm<CreateAlbumDto>({
		resolver: zodResolver(CreateAlbumSchema),
		defaultValues: {
			title: '',
			changeableId: '',
			type: 'ep',
			image: undefined,
			tracks: []
		},
		disabled: !currentUser
	});

	const tracksField = useFieldArray({
		control: createAlbumForm.control,
		name: 'tracks'
	});

	const uploadMutation = useMutation({
		mutationFn: (dto: FormData) =>
			albumService.create(dto as unknown as CreateAlbumDto),
		onSuccess: () => {
			toast({ title: 'Album uploaded' });

			if (imageUrl) {
				URL.revokeObjectURL(imageUrl);
			}
			setImageUrl(undefined);

			createAlbumForm.reset({
				title: '',
				changeableId: '',
				type: 'ep',
				image: undefined,
				tracks: []
			});
		},
		onMutate: () => {
			toast({ title: 'Uploading album, please wait...' });
		}
	});

	function onSubmit(dto: CreateAlbumDto) {
		const tracks: { changeableId: string; title: string }[] = [];
		const audios: File[] = [];

		dto.tracks.map((track) => {
			tracks.push({ changeableId: track.changeableId, title: track.title });
			audios.push(track.audio!);
		});

		const formData = new FormData();

		formData.append('title', dto.title);
		formData.append('changeableId', dto.changeableId);
		formData.append('type', dto.type);
		formData.append('tracks', JSON.stringify(tracks));
		formData.append('image', dto.image);
		for (const audio of audios) {
			formData.append('audios', audio);
		}

		uploadMutation.mutate(formData);
	}

	return (
		<>
			<nav className='grid gap-4 text-lg text-muted-foreground'>
				<Link href='/upload/track'>Track</Link>
				<Link href='/upload/album' className='font-semibold text-primary'>
					Album
				</Link>
				<Link href='/upload/playlist'>Playlist</Link>
			</nav>
			<div className='rounded-md border bg-card p-6 text-card-foreground shadow-sm'>
				<form
					onSubmit={createAlbumForm.handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col gap-6'
				>
					<div className='flex justify-between gap-4'>
						<div className='flex flex-col gap-4'>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='title'>Title</Label>
								<div className='flex h-10 w-80 items-center rounded-md border border-border px-2'>
									<Input
										id='title'
										placeholder='Title'
										required
										maxLength={20}
										{...createAlbumForm.register('title')}
									/>
								</div>
								{createAlbumForm.formState.errors.title && (
									<p className='text-sm text-destructive'>
										{createAlbumForm.formState.errors.title.message}
									</p>
								)}
							</div>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='changeableId'>Album id</Label>
								<div className='flex h-10 w-80 items-center rounded-md border border-border px-2'>
									<Input
										id='changeableId'
										required
										placeholder='Album id'
										maxLength={20}
										{...createAlbumForm.register('changeableId')}
									/>
								</div>
								{createAlbumForm.formState.errors.changeableId && (
									<p className='text-sm text-destructive'>
										{createAlbumForm.formState.errors.changeableId.message}
									</p>
								)}
							</div>
							<div className='flex flex-col gap-2'>
								<Controller
									name='type'
									control={createAlbumForm.control}
									render={({ field: { onChange, value, ...field } }) => (
										<>
											<p className='text-sm font-medium leading-none'>
												Album type
											</p>
											<RadioGroup
												id='type'
												required
												onValueChange={onChange}
												defaultValue={value}
												{...field}
											>
												<RadioGroupItem id='ep' value='ep' />
												<Label htmlFor='ep'>EP</Label>
												<RadioGroupItem id='lp' value='lp' />
												<Label htmlFor='lp'>LP</Label>
											</RadioGroup>
										</>
									)}
								/>
							</div>
						</div>

						<Controller
							name='image'
							control={createAlbumForm.control}
							render={({
								field: { onChange, value, ...field },
								fieldState: { error }
							}) => (
								<div>
									<div className='min-size-52 group relative mb-2 size-52 rounded-md border'>
										{imageUrl ? (
											<>
												<Button
													variant='outline'
													size='icon'
													type='button'
													className='absolute right-2 top-2 z-10 rounded-md opacity-0 transition-opacity group-hover:opacity-100'
													onClick={() => {
														setImageUrl(undefined);
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
												className='flex size-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md p-6'
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
												const file = e.target.files?.[0];
												if (file) {
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
									</div>
									{error && (
										<p className='text-sm text-destructive'>{error.message}</p>
									)}
								</div>
							)}
						/>
					</div>
					<div className='flex flex-col'>
						<p className='mb-2 text-sm font-medium leading-none'>Tracks</p>
						{createAlbumForm.formState.errors.tracks?.root && (
							<p className='text-sm text-destructive'>
								{createAlbumForm.formState.errors.tracks.root.message}
							</p>
						)}
						{createAlbumForm.formState.errors.tracks?.length && (
							<p className='text-sm text-destructive'>
								Title, id and audio is required for tracks
							</p>
						)}
						<UploadAlbumTable
							tracksField={tracksField}
							createAlbumForm={createAlbumForm}
						></UploadAlbumTable>
						<Button
							disabled={!currentUser}
							className='mt-2'
							type='button'
							variant='outline'
							onClick={() =>
								tracksField.append({
									audio: undefined,
									changeableId: '',
									title: ''
								})
							}
						>
							Add new track
						</Button>
					</div>
					<div className='flex items-center gap-4'>
						<Button disabled={!currentUser} type='submit' className='w-min'>
							Upload
						</Button>
						<LoadingSpinner
							className={uploadMutation.isPending ? 'opacity-100' : ''}
						/>
					</div>
				</form>
			</div>
		</>
	);
}
