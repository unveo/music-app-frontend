'use client';

import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import {
	type CreatePlaylistDto,
	CreatePlaylistSchema
} from '@/services/playlist/playlist.types';
import { playlistService } from '@/services/playlist/playlist.service';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { ImageUp, X } from 'lucide-react';
import { validateImage } from '@/lib/utils';
import { ACCEPTED_IMAGE_TYPES } from '@/config';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useCurrentUserQuery } from '@/hooks/queries';
import { Label } from '@/components/ui/label';

export default function CreatePlaylist() {
	const [imageUrl, setImageUrl] = useState<string | undefined>();

	const { toast } = useToast();

	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const {
		control,
		formState: { errors },
		register,
		handleSubmit,
		reset
	} = useForm<CreatePlaylistDto>({
		resolver: zodResolver(CreatePlaylistSchema),
		defaultValues: {
			image: undefined,
			changeableId: '',
			title: ''
		},
		disabled: !currentUser
	});

	const createMutation = useMutation({
		mutationFn: (dto: FormData) =>
			playlistService.create(dto as unknown as CreatePlaylistDto),
		onSuccess: () => {
			toast({ title: 'Playlist created' });

			if (imageUrl) {
				URL.revokeObjectURL(imageUrl);
			}

			setImageUrl(undefined);
			reset({
				image: undefined,
				changeableId: '',
				title: ''
			});
		}
	});

	function onSubmit(dto: CreatePlaylistDto) {
		const formData = new FormData();

		formData.append('title', dto.title);
		formData.append('changeableId', dto.changeableId);
		formData.append('image', dto.image);

		createMutation.mutate(formData);
	}

	return (
		<>
			<nav className='grid gap-4 text-lg text-muted-foreground'>
				<Link href='/upload/track'>Track</Link>
				<Link href='/upload/album'>Album</Link>
				<Link href='/upload/playlist' className='font-semibold text-primary'>
					Playlist
				</Link>
			</nav>
			<div className='grid gap-6'>
				<div className='rounded-md border bg-card p-6 text-card-foreground shadow-sm'>
					<form
						onSubmit={handleSubmit(onSubmit)}
						noValidate
						className='flex flex-col gap-6'
					>
						<div className='flex gap-4'>
							<div className='flex w-full flex-col gap-4'>
								<div className='grid gap-2'>
									<div className='flex flex-col gap-2'>
										<Label htmlFor='title'>Title</Label>
										<div className='flex items-center gap-2'>
											<div className='flex h-10 w-80 items-center rounded-md border border-border px-2'>
												<Input
													id='title'
													placeholder='Title'
													required
													maxLength={20}
													{...register('title')}
												/>
											</div>
										</div>
										{errors.title && (
											<p className='text-sm text-destructive'>
												{errors.title.message}
											</p>
										)}
									</div>
								</div>
								<div className='grid gap-2'>
									<div className='flex flex-col gap-2'>
										<Label htmlFor='changeableId'>Playlist id</Label>
										<div className='flex items-center gap-2'>
											<div className='flex h-10 w-80 items-center rounded-md border border-border px-2'>
												<Input
													id='changeableId'
													required
													placeholder='Playlist id'
													maxLength={20}
													{...register('changeableId')}
												/>
											</div>
										</div>
										{errors.changeableId && (
											<p className='text-sm text-destructive'>
												{errors.changeableId.message}
											</p>
										)}
									</div>
								</div>
							</div>
							<Controller
								control={control}
								name='image'
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
													<span>Click to upload image</span>
													<span className='text-xs'>JPG or PNG</span>
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
											<p className='text-sm text-destructive'>
												{error.message}
											</p>
										)}
									</div>
								)}
							/>
						</div>
						<div className='flex items-center gap-4'>
							<Button disabled={!currentUser} type='submit' className='w-min'>
								Create
							</Button>
							<LoadingSpinner
								className={createMutation.isPending ? 'opacity-100' : ''}
							/>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
