'use client';

import { Button } from '@/components/ui/button';
import {
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormField,
	Form
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import {
	type UploadTrackDto,
	UploadTrackSchema
} from '@/services/track/track.types';
import { trackService } from '@/services/track/track.service';
import { userService } from '@/services/user/user.service';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { FileCheck, FileUp, ImageUp, X } from 'lucide-react';
import { validateAudio, validateImage } from '@/lib/utils';
import { ACCEPTED_AUDIO_TYPES, ACCEPTED_IMAGE_TYPES } from '@/config';

export default function UploadTrack() {
	const [imageUrl, setImageUrl] = useState<string | undefined>();
	const [audio, setAudio] = useState<File | undefined>();
	const { toast } = useToast();

	const currentUserQuery = useQuery({
		queryKey: ['current-user'],
		queryFn: () => userService.getCurrent()
	});
	const currentUser = currentUserQuery.data?.data;

	const uploadForm = useForm<UploadTrackDto>({
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
		mutationKey: ['upload-track'],
		mutationFn: (dto: FormData) =>
			trackService.upload(dto as unknown as UploadTrackDto),
		onSuccess: () => {
			toast({ title: 'Track uploaded' });
			if (imageUrl) {
				URL.revokeObjectURL(imageUrl);
			}
			setImageUrl(undefined);
			setAudio(undefined);
			uploadForm.reset({
				audio: undefined,
				image: undefined,
				changeableId: '',
				title: ''
			});
		}
	});

	function handleAudio(
		field: ControllerRenderProps<
			{
				title: string;
				changeableId: string;
				image: File;
				audio: File;
			},
			'audio'
		>,
		file: File
	) {
		try {
			validateAudio(file);
		} catch (err: any) {
			toast({
				title: err.message,
				variant: 'destructive'
			});
			return;
		}
		setAudio(file);
		field.onChange(file);
	}

	function handleImage(
		field: ControllerRenderProps<
			{
				title: string;
				changeableId: string;
				image: File;
				audio: File;
			},
			'image'
		>,
		file: File
	) {
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
		field.onChange(file);
	}

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
			</nav>
			<div className='grid gap-6'>
				<div className='rounded-md border bg-card p-6 text-card-foreground shadow-sm'>
					<Form {...uploadForm}>
						<form
							onSubmit={uploadForm.handleSubmit(onSubmit)}
							noValidate
							className='flex flex-col gap-6'
						>
							<div className='flex gap-4'>
								<div className='flex w-full flex-col justify-between gap-4'>
									<FormField
										control={uploadForm.control}
										name='title'
										render={({ field }) => (
											<FormItem className='grid gap-2'>
												<div className='flex flex-col gap-2'>
													<FormLabel htmlFor='title'>Title</FormLabel>
													<div className='flex items-center gap-2'>
														<FormControl>
															<div className='flex h-10 w-80 items-center rounded-md border border-border px-2'>
																<Input
																	id='title'
																	placeholder='Title'
																	required
																	{...field}
																/>
															</div>
														</FormControl>
													</div>
													<FormMessage />
												</div>
											</FormItem>
										)}
									/>
									<FormField
										control={uploadForm.control}
										name='changeableId'
										render={({ field }) => (
											<FormItem className='grid gap-2'>
												<div className='flex flex-col gap-2'>
													<FormLabel htmlFor='changeableId'>Track id</FormLabel>
													<div className='flex items-center gap-2'>
														<FormControl>
															<div className='flex h-10 w-80 items-center rounded-md border border-border px-2'>
																<Input
																	id='changeableId'
																	required
																	placeholder='Track id'
																	{...field}
																/>
															</div>
														</FormControl>
													</div>
													<FormMessage />
												</div>
											</FormItem>
										)}
									/>
									<FormField
										control={uploadForm.control}
										name='audio'
										render={({ field }) => (
											<FormItem className='grid gap-2'>
												<div className='group relative h-28 w-full rounded-md'>
													{audio ? (
														<>
															<Button
																variant='outline'
																size='icon'
																type='button'
																className='absolute right-2 top-2 z-10 rounded-md opacity-0 transition-opacity group-hover:opacity-100'
																onClick={() => {
																	setAudio(undefined);
																	field.onChange(undefined);
																}}
															>
																<X className='size-5' />
															</Button>
															<FormLabel
																htmlFor='audio'
																className='flex h-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border py-4'
															>
																<FileCheck className='size-8'></FileCheck>
																<span className='text-base'>{audio.name}</span>
															</FormLabel>
														</>
													) : (
														<FormLabel
															htmlFor='audio'
															className='flex h-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border'
														>
															<FileUp className='size-8'></FileUp>
															<span>Click to upload audio</span>
															<span className='text-xs'>
																MP3, AAC, M4A, FLAC, WAV, AIFF, or WEBM
															</span>
														</FormLabel>
													)}
													<FormControl>
														<Input
															type='file'
															id='audio'
															className='hidden'
															accept={`.mp3, .aac, .m4a, .flac, .wav, .aiff, .webm, ${ACCEPTED_AUDIO_TYPES.join(', ')}`} //
															onChange={(e) => {
																if (e.target.files?.[0]) {
																	handleAudio(field, e.target.files[0]);
																}
															}}
														/>
													</FormControl>
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={uploadForm.control}
									name='image'
									render={({ field }) => (
										<FormItem>
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
																field.onChange(undefined);
															}}
														>
															<X className='size-5' />
														</Button>
														<FormLabel
															htmlFor='image'
															className='absolute bottom-2 right-2 z-10 flex h-10 cursor-pointer items-center rounded-md border border-input bg-background px-4 py-2 opacity-0 transition-opacity hover:bg-accent hover:text-accent-foreground group-hover:opacity-100'
														>
															Edit
														</FormLabel>
													</>
												) : (
													<FormLabel
														htmlFor='image'
														className='flex size-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md p-6'
													>
														<ImageUp className='size-8'></ImageUp>
														<span>Click to upload image</span>
														<span className='text-xs'>JPG or PNG</span>
													</FormLabel>
												)}
												<FormControl>
													<Input
														type='file'
														id='image'
														accept={`.jpg, .png, ${ACCEPTED_IMAGE_TYPES.join(', ')}`}
														onChange={(e) => {
															if (e.target.files?.[0]) {
																handleImage(field, e.target.files[0]);
															}
														}}
														className='hidden'
													/>
												</FormControl>
												{imageUrl && (
													<div className='absolute top-0 size-52 min-h-52 min-w-52'>
														<Image
															src={imageUrl}
															alt='Image preview'
															className='aspect-square rounded-md object-cover'
															width={250}
															height={250}
														/>
													</div>
												)}
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<Button disabled={!currentUser} type='submit' className='w-min'>
								Upload
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</>
	);
}
