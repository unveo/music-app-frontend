'use client';

import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import {
	type UploadTrackDto,
	UploadTrackSchema
} from '@/services/track/track.types';
import { trackService } from '@/services/track/track.service';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { FileCheck, FileUp, ImageUp, X } from 'lucide-react';
import { validateAudio, validateImage } from '@/lib/utils';
import { ACCEPTED_AUDIO_TYPES, ACCEPTED_IMAGE_TYPES } from '@/config';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useCurrentUserQuery } from '@/hooks/queries';
import { Label } from '@/components/ui/label';

export default function UploadTrack() {
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
	} = useForm<UploadTrackDto>({
		resolver: zodResolver(UploadTrackSchema),
		defaultValues: {
			audio: undefined,
			image: undefined,
			changeableId: '',
			title: ''
		},
		disabled: !currentUser
	});

	const uploadMutation = useMutation({
		mutationFn: (dto: FormData) =>
			trackService.upload(dto as unknown as UploadTrackDto),
		onSuccess: () => {
			toast({ title: 'Track uploaded' });

			if (imageUrl) {
				URL.revokeObjectURL(imageUrl);
			}

			setImageUrl(undefined);
			reset({
				audio: undefined,
				image: undefined,
				changeableId: '',
				title: ''
			});
		},
		onMutate: () => {
			toast({ title: 'Uploading track, please wait...' });
		}
	});

	function onSubmit(dto: UploadTrackDto) {
		const formData = new FormData();

		formData.append('title', dto.title);
		formData.append('changeableId', dto.changeableId);
		formData.append('audio', dto.audio);
		formData.append('image', dto.image);

		uploadMutation.mutate(formData);
	}

	return (
		<>
			<nav className='grid gap-4 text-lg text-muted-foreground'>
				<Link href='/upload/track' className='font-semibold text-primary'>
					Track
				</Link>
				<Link href='/upload/album'>Album</Link>
				<Link href='/upload/playlist'>Playlist</Link>
			</nav>
			<div className='rounded-md border bg-card p-6 text-card-foreground shadow-sm'>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col gap-6'
				>
					<div className='flex flex-col gap-4 lg:flex-row'>
						<div className='flex w-full flex-col justify-between gap-4'>
							<div className='flex flex-col gap-2'>
								<div className='flex flex-col gap-2'>
									<Label htmlFor='title'>Title</Label>
									<div className='flex items-center gap-2'>
										<div className='flex h-10 w-64 items-center rounded-md border border-border px-2 md:w-80'>
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
							<div className='flex flex-col gap-2'>
								<div className='flex flex-col gap-2'>
									<Label htmlFor='changeableId'>Track id</Label>
									<div className='flex items-center gap-2'>
										<div className='flex h-10 w-64 items-center rounded-md border border-border px-2 md:w-80'>
											<Input
												id='changeableId'
												required
												placeholder='Track id'
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
							<Controller
								control={control}
								name='audio'
								render={({
									field: { onChange, value, ...field },
									fieldState: { error }
								}) => (
									<div className='flex flex-col gap-2'>
										<div className='group relative h-28 w-64 rounded-md md:w-96 xl:w-[30rem]'>
											{value ? (
												<>
													<Button
														variant='outline'
														size='icon'
														type='button'
														className='absolute right-2 top-2 z-10 rounded-md opacity-0 transition-opacity group-hover:opacity-100'
														onClick={() => {
															onChange(undefined);
														}}
													>
														<X className='size-5' />
													</Button>
													<Label
														htmlFor='audio'
														className='flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden text-nowrap rounded-md border p-4'
													>
														<FileCheck className='size-8'></FileCheck>
														<span className='max-w-full overflow-hidden text-nowrap text-base'>
															{value.name}
														</span>
													</Label>
												</>
											) : (
												<Label
													htmlFor='audio'
													className='flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border'
												>
													<FileUp className='size-8'></FileUp>
													<span>Click to upload audio</span>
													<span className='text-xs'>
														MP3, AAC, FLAC, WAV, AIFF, or WEBM
													</span>
												</Label>
											)}
											<Input
												type='file'
												id='audio'
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
										{error && (
											<p className='text-sm text-destructive'>
												{error.message}
											</p>
										)}
									</div>
								)}
							/>
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
										<p className='text-sm text-destructive'>{error.message}</p>
									)}
								</div>
							)}
						/>
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
