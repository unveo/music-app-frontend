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
import { useForm } from 'react-hook-form';
import { userService } from '@/services/user/user.service';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { ImageUp, X } from 'lucide-react';
import { validateAudio, validateImage } from '@/lib/utils';
import { ACCEPTED_AUDIO_TYPES, ACCEPTED_IMAGE_TYPES } from '@/config';
import {
	CreateAlbumDto,
	CreateAlbumSchema
} from '@/services/album/album.types';
import { albumService } from '@/services/album/album.service';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import TrackRow from '@/components/TrackRow';

export default function UploadAlbum() {
	const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
	// const [audios, setAudios] = useState<File[]>([]);
	const [tracks, setTracks] = useState<
		{
			title: string;
			changeableId: string;
			audio: File | undefined;
		}[]
	>([]);
	const { toast } = useToast();

	const currentUserQuery = useQuery({
		queryKey: ['current-user'],
		queryFn: () => userService.getCurrent()
	});
	const currentUser = currentUserQuery.data?.data;

	const uploadForm = useForm<CreateAlbumDto>({
		resolver: zodResolver(CreateAlbumSchema),
		defaultValues: {
			title: '',
			changeableId: '',
			type: 'ep',
			image: undefined
		},
		disabled: !currentUser
	});

	const uploadMutation = useMutation({
		mutationKey: ['upload-album'],
		mutationFn: (dto: FormData) =>
			albumService.create(dto as unknown as CreateAlbumDto),
		onSuccess: () => {
			toast({ title: 'Album uploaded' });
			if (imageUrl) {
				URL.revokeObjectURL(imageUrl);
			}
			setImageUrl(undefined);
			// setAudios([]);
			setTracks([]);
			uploadForm.reset({
				title: '',
				changeableId: '',
				type: 'ep',
				image: undefined
			});
		}
	});

	function onSubmit(dto: CreateAlbumDto) {
		console.log(dto);
		// let tracks: { title: string; changeableId: string; position: number }[] =
		// 	[];
		// let audios: any[] = [];
		// albumTracks.map((track, index) => {
		// 	tracks.push({
		// 		title: track.title,
		// 		changeableId: track.changeableId,
		// 		position: index + 1
		// 	});
		// 	audios.push(track.audio);
		// });
		// uploadForm.setValue('tracks', tracks);
		// uploadForm.setValue('audios', audios);

		// const formData = new FormData();
		// formData.append('title', dto.title);
		// formData.append('changeableId', dto.changeableId);
		// formData.append('type', dto.type);
		// formData.append('tracks', JSON.stringify(dto.tracks));
		// formData.append('image', dto.image);
		// formData.append('image', JSON.stringify(dto.audios));
		// uploadMutation.mutate(formData);
	}

	return (
		<>
			<nav className='grid gap-4 text-lg text-muted-foreground'>
				<Link href='/upload/track'>Track</Link>
				<Link href='/upload/album' className='font-semibold text-primary'>
					Album
				</Link>
			</nav>
			<div className='grid gap-6'>
				<div className='rounded-md border bg-card p-6 text-card-foreground shadow-sm'>
					<Form {...uploadForm}>
						<form
							onSubmit={uploadForm.handleSubmit(onSubmit)}
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
														<FormMessage />
													</div>
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
													<FormLabel htmlFor='changeableId'>Album id</FormLabel>
													<div className='flex items-center gap-2'>
														<FormControl>
															<div className='flex h-10 w-80 items-center rounded-md border border-border px-2'>
																<Input
																	id='changeableId'
																	required
																	placeholder='Album id'
																	{...field}
																/>
															</div>
														</FormControl>
														<FormMessage className='w-64' />
													</div>
												</div>
											</FormItem>
										)}
									/>
									<FormField
										control={uploadForm.control}
										name='type'
										render={({ field }) => (
											<FormItem className='grid gap-2'>
												<div className='flex flex-col gap-2'>
													<FormLabel htmlFor='type'>Album type</FormLabel>
													<div className='flex items-center gap-2'>
														<FormControl>
															<RadioGroup
																id='type'
																required
																onValueChange={field.onChange}
																defaultValue={field.value}
																className='flex flex-col'
															>
																<FormItem className='flex items-center gap-2'>
																	<FormControl>
																		<RadioGroupItem value='ep' />
																	</FormControl>
																	<FormLabel>EP</FormLabel>
																</FormItem>
																<FormItem className='flex items-center gap-2'>
																	<FormControl>
																		<RadioGroupItem value='lp' />
																	</FormControl>
																	<FormLabel>LP</FormLabel>
																</FormItem>
															</RadioGroup>
														</FormControl>
														<FormMessage className='w-64' />
													</div>
												</div>
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={uploadForm.control}
									name='image'
									render={({ field }) => (
										<FormItem className='flex gap-2'>
											<div className='min-size-52 group relative size-52 rounded-md border'>
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
																field.onChange(file);
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
							<div>
								<span className='mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
									Tracks
								</span>
								{tracks.length ? (
									<>
										<div className='mt-2 flex items-center gap-8 px-2'>
											<span className='flex w-2'>#</span>
											<span className='flex w-44 pl-2'>Title</span>
											<span className='flex w-44 pl-2'>Id</span>
											<span className='flex w-44 justify-center'>Audio</span>
										</div>
										<Separator className='my-2' />
									</>
								) : (
									<></>
								)}
								<ul>
									{tracks.map((track, index) => (
										<TrackRow key={index} index={index}></TrackRow>
									))}
								</ul>
								<Button
									disabled={!currentUser}
									className='mt-2 w-min'
									type='button'
									variant='outline'
									onClick={() => {
										setTracks([
											...tracks,
											{ audio: undefined, changeableId: '', title: '' }
										]);
									}}
								>
									Add new track
								</Button>
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
