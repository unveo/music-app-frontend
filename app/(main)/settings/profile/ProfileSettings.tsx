'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Controller, useForm } from 'react-hook-form';

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
					<form
						onSubmit={changeUsernameForm.handleSubmit((dto) => {
							changeUsernameMutation.mutate(dto);
						})}
						noValidate
						className='grid gap-4'
					>
						<div className='grid gap-2'>
							<div className='flex items-end justify-between'>
								<Label htmlFor='username' className='w-min text-lg'>
									Username
								</Label>
								{currentUser?.username ? (
									<div className='text-end text-zinc-400'>
										Current username: {currentUser?.username}
									</div>
								) : null}
							</div>
							<div className='flex h-10 items-center rounded-md border border-border px-2'>
								<Input
									id='username'
									required
									maxLength={20}
									{...changeUsernameForm.register('username')}
								/>
							</div>
							{changeUsernameForm.formState.errors.username && (
								<p className='text-sm text-destructive'>
									{changeUsernameForm.formState.errors.username.message}
								</p>
							)}
						</div>
						<Button disabled={!currentUser} type='submit' className='w-min'>
							Save
						</Button>
					</form>
				</div>
				<div className='rounded-md border bg-card p-6 text-card-foreground shadow-sm'>
					<form
						onSubmit={changeImageForm.handleSubmit((dto) => {
							const formData = new FormData();
							formData.append('image', dto.image);
							changeImageMutation.mutate(formData);
						})}
						className='flex flex-col justify-between gap-4'
					>
						<Controller
							control={changeImageForm.control}
							name='image'
							render={({
								field: { onChange, value, ...field },
								fieldState: { error }
							}) => (
								<div className='grid gap-2'>
									<Label htmlFor='image' className='w-min text-lg'>
										Image
									</Label>
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
												alt='New image'
												className='object-coverr absolute top-0 aspect-square size-full rounded-md'
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
						<Button disabled={!currentUser} type='submit' className='w-min'>
							Save
						</Button>
					</form>
				</div>
			</div>
		</>
	);
}
