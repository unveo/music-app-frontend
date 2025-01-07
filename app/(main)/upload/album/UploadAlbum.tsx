'use client';

import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { userService } from '@/services/user/user.service';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { ImageUp, X } from 'lucide-react';
import { validateAudio, validateImage } from '@/lib/utils';
import { ACCEPTED_AUDIO_TYPES, ACCEPTED_IMAGE_TYPES } from '@/config';
import {
	CreateAlbumDto,
	CreateAlbumSchema
} from '@/services/album/album.types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { albumService } from '@/services/album/album.service';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import SortableRow from '@/components/SortableRow';
import {
	DndContext,
	DragEndEvent,
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

export default function UploadAlbum() {
	const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
	const { toast } = useToast();

	const currentUserQuery = useQuery({
		queryKey: ['current-user'],
		queryFn: () => userService.getCurrent()
	});
	const currentUser = currentUserQuery.data?.data;

	const {
		control,
		formState: { errors },
		register,
		handleSubmit,
		getValues,
		reset
	} = useForm<CreateAlbumDto>({
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

	const { fields, append, remove, move } = useFieldArray({
		control,
		name: 'tracks'
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

			reset({
				title: '',
				changeableId: '',
				type: 'ep',
				image: undefined,
				tracks: []
			});
		}
	});

	function onSubmit(dto: CreateAlbumDto) {
		let tracks: { changeableId: string; title: string }[] = [];
		let audios: File[] = [];

		dto.tracks.map((track) => {
			tracks.push({ changeableId: track.changeableId, title: track.title });
			audios.push(track.audio!); //
		});

		const formData = new FormData();
		formData.append('title', dto.title);
		formData.append('changeableId', dto.changeableId);
		formData.append('type', dto.type);
		formData.append('tracks', JSON.stringify(tracks));
		formData.append('image', dto.image);
		for (let audio of audios) {
			formData.append('audios', audio);
		}

		uploadMutation.mutate(formData);
	}

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
			const oldIndex = fields.findIndex((item) => item.id === active.id);
			const newIndex = fields.findIndex((item) => item.id === over?.id);
			move(oldIndex, newIndex);
		}
	};

	return (
		<>
			<nav className='grid gap-4 text-lg text-muted-foreground'>
				<Link href='/upload/track'>Track</Link>
				<Link href='/upload/album' className='font-semibold text-primary'>
					Album
				</Link>
			</nav>
			<div className='rounded-md border bg-card p-6 text-card-foreground shadow-sm'>
				<form
					onSubmit={handleSubmit(onSubmit)}
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
										{...register('title')}
									/>
								</div>
								{errors.title && (
									<p className='text-sm text-destructive'>
										{errors.title.message}
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
										{...register('changeableId')}
									/>
								</div>
								{errors.changeableId && (
									<p className='text-sm text-destructive'>
										{errors.changeableId.message}
									</p>
								)}
							</div>
							<div className='flex flex-col gap-2'>
								<Controller
									name='type'
									control={control}
									render={({ field: { onChange, value, ...field } }) => (
										<>
											<span>Album type</span>
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
							control={control}
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
									</div>
									{error && (
										<p className='text-sm text-destructive'>{error.message}</p>
									)}
								</div>
							)}
						/>
					</div>
					<div className='flex flex-col'>
						<span className='mb-2'>Tracks</span>
						{errors.tracks?.root && (
							<p className='text-sm text-destructive'>
								{errors.tracks.root.message}
							</p>
						)}
						{errors.tracks?.length && (
							<p className='text-sm text-destructive'>
								Title, id and audio is required for tracks
							</p>
						)}
						{fields.length ? (
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								modifiers={[restrictToVerticalAxis, restrictToParentElement]}
								onDragEnd={handleDragEnd}
							>
								<SortableContext
									items={fields.map((field) => field.id)}
									strategy={verticalListSortingStrategy}
								>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className='w-0'>#</TableHead>
												<TableHead>Title</TableHead>
												<TableHead>Id</TableHead>
												<TableHead className='text-center'>Audio</TableHead>
												<TableHead className='text-right'>Remove</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{fields.map((field, index) => (
												<SortableRow key={field.id} id={field.id} index={index}>
													<TableCell>
														<Label
															htmlFor={`tracks.${index}.title`}
															className='hidden'
														>
															Track Title
														</Label>
														<Input
															placeholder='Title'
															required
															maxLength={20}
															id={`tracks.${index}.title`}
															{...register(`tracks.${index}.title`)}
															className='bg-transparent'
														/>
													</TableCell>
													<TableCell>
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
															{...register(`tracks.${index}.changeableId`)}
															className='bg-transparent'
														/>
													</TableCell>
													<TableCell className='py-0'>
														<Controller
															name={`tracks.${index}.audio`}
															control={control}
															render={({ field: { onChange, value } }) => (
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
																				className='flex h-10 w-44 cursor-pointer items-center justify-center rounded-md border px-4'
																			>
																				<span className='overflow-hidden text-nowrap'>
																					{value.name}
																				</span>
																			</Label>
																		</>
																	) : (
																		<Label
																			htmlFor={`tracks.${index}.audio`}
																			className='flex h-10 w-44 cursor-pointer items-center justify-center rounded-md border px-4'
																		>
																			Upload audio
																		</Label>
																	)}
																	<Input
																		type='file'
																		id={`tracks.${index}.audio`}
																		className='hidden'
																		accept={`.mp3, .aac, .m4a, .flac, .wav, .aiff, .webm, ${ACCEPTED_AUDIO_TYPES.join(', ')}`}
																		onChange={(e) => {
																			if (e.target.files?.[0]) {
																				const file = e.target.files[0];
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
																	/>
																</div>
															)}
														/>
													</TableCell>
													<TableCell className='py-0'>
														<div className='flex justify-end'>
															<Button
																type='button'
																variant='destructive'
																size='icon'
																onClick={() => remove(index)}
															>
																<X className='size-5'></X>
															</Button>
														</div>
													</TableCell>
												</SortableRow>
											))}
										</TableBody>
									</Table>
								</SortableContext>
							</DndContext>
						) : (
							<></>
						)}
						<Button
							disabled={!currentUser}
							className='mt-2'
							type='button'
							variant='outline'
							onClick={() =>
								append({ audio: undefined, changeableId: '', title: '' })
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
