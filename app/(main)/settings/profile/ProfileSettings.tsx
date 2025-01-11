'use client';

import { Button } from '@/components/ui/button';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Form
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ACCEPTED_IMAGE_TYPES } from '@/config';
import { useCurrentUserQuery } from '@/hooks/queries';
import { validateImage } from '@/lib/utils';
import { userService } from '@/services/user/user.service';
import {
	type ChangeImageDto,
	ChangeImageSchema,
	type ChangeUsernameDto,
	ChangeUsernameSchema
} from '@/services/user/user.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ImageUp, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ControllerRenderProps, FormProvider, useForm } from 'react-hook-form';

export default function ProfileSettings() {
	const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

	const { toast } = useToast();

	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const changeUsernameForm = useForm<ChangeUsernameDto>({
		resolver: zodResolver(ChangeUsernameSchema),
		defaultValues: { username: '' },
		mode: 'onChange',
		disabled: !currentUser
	});

	const changeImageForm = useForm<ChangeImageDto>({
		resolver: zodResolver(ChangeImageSchema),
		defaultValues: { image: undefined },
		disabled: !currentUser
	});

	const changeUsernameMutation = useMutation({
		mutationFn: (dto: ChangeUsernameDto) => userService.update(dto),
		onSuccess: () => {
			toast({ title: 'Username updated' });
			currentUserQuery.refetch();
		}
	});

	const changeImageMutation = useMutation({
		mutationFn: (dto: FormData) =>
			userService.update(dto as unknown as ChangeImageDto),
		onSuccess: () => {
			toast({ title: 'Image updated' });

			if (imageUrl) {
				URL.revokeObjectURL(imageUrl);
			}
			setImageUrl(undefined);
			changeImageForm.reset({ image: undefined });

			currentUserQuery.refetch();
		}
	});

	return (
		<>
			<nav className='grid gap-4 text-lg text-muted-foreground'>
				<Link href='/settings/profile' className='font-semibold text-primary'>
					Profile
				</Link>
				<Link href='/settings/security'>Security</Link>
			</nav>
			<div className='grid gap-6'>
				<div className='rounded-md border bg-card p-6 text-card-foreground shadow-sm'>
					<FormProvider {...changeUsernameForm}>
						<form
							onSubmit={changeUsernameForm.handleSubmit((dto) => {
								changeUsernameMutation.mutate(dto);
							})}
							noValidate
							className='grid gap-4'
						>
							<FormField
								control={changeUsernameForm.control}
								name='username'
								render={({ field }) => (
									<FormItem className='grid'>
										<div className='flex items-end justify-between'>
											<FormLabel htmlFor='username' className='w-min text-lg'>
												Username
											</FormLabel>
											{currentUser?.username ? (
												<div className='text-end text-zinc-400'>
													Current username: {currentUser?.username}
												</div>
											) : null}
										</div>
										<FormControl>
											<div className='flex h-10 items-center rounded-md border border-border px-2'>
												<Input id='username' required {...field} />
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button disabled={!currentUser} type='submit' className='w-min'>
								Save
							</Button>
						</form>
					</FormProvider>
				</div>
				<div className='rounded-md border bg-card p-6 text-card-foreground shadow-sm'>
					<Form {...changeImageForm}>
						<form
							onSubmit={changeImageForm.handleSubmit((dto) => {
								const formData = new FormData();
								formData.append('image', dto.image);
								changeImageMutation.mutate(formData);
							})}
							className='flex flex-col justify-between gap-4'
						>
							<FormField
								control={changeImageForm.control}
								name='image'
								render={({ field }) => (
									<FormItem className='grid'>
										<FormLabel htmlFor='image' className='w-min text-lg'>
											Image
										</FormLabel>
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
															field.onChange(file);
														}
													}}
													className='hidden'
												/>
											</FormControl>
											{imageUrl && (
												<Image
													src={imageUrl}
													alt='New image'
													className='object-coverr absolute top-0 aspect-square size-full rounded-md'
													width={250}
													height={250}
												/>
											)}
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button disabled={!currentUser} type='submit' className='w-min'>
								Save
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</>
	);
}
