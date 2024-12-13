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
import {
	ACCEPTED_AUDIO_TYPES,
	ACCEPTED_IMAGE_TYPES,
	IMAGE_FILE_LIMIT
} from '@/config';
import { validateImage } from '@/lib/utils';
import { userService } from '@/services/user/user.service';
import {
	ChangeImageDto,
	ChangeImageSchema,
	ChangeUsernameDto,
	ChangeUsernameSchema
} from '@/services/user/user.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ImageUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export default function ProfileSettings() {
	const currentUserQuery = useQuery({
		queryKey: ['current-user'],
		queryFn: () => userService.getCurrent()
	});
	const currentUser = currentUserQuery.data?.data;

	const changeUsernameForm = useForm<ChangeUsernameDto>({
		resolver: zodResolver(ChangeUsernameSchema),
		defaultValues: { username: currentUser?.username },
		mode: 'onChange',
		disabled: !currentUser
	});
	const changeImageForm = useForm<ChangeImageDto>({
		resolver: zodResolver(ChangeImageSchema),
		defaultValues: { image: undefined },
		disabled: !currentUser
	});

	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const { toast } = useToast();

	const changeUsernameMutation = useMutation({
		mutationKey: ['change-username'],
		mutationFn: (dto: ChangeUsernameDto) => userService.update(dto),
		onSuccess: () => {
			toast({ title: 'Username updated' });
			currentUserQuery.refetch();
		},
		onError: (error) => {
			toast({ title: `${error.message}`, variant: 'destructive' });
		}
	});
	const changeImageMutation = useMutation({
		mutationKey: ['change-avatar'],
		mutationFn: (dto: FormData) =>
			userService.update(dto as unknown as ChangeImageDto),
		onSuccess: () => {
			toast({ title: 'Image updated' });
			URL.revokeObjectURL(imageUrl!);
			setImageUrl(null);
			changeImageForm.setValue('image', undefined); // TODO
			currentUserQuery.refetch();
		},
		onError: (error) => {
			toast({ title: `${error.message}`, variant: 'destructive' });
		}
	});

	useEffect(() => {
		if (currentUser) {
			changeUsernameForm.setValue('username', currentUser.username);
		}
	}, [currentUser?.username, currentUser, changeUsernameForm]);

	function handleImage(file?: File) {
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
			const imageUrlUrl = URL.createObjectURL(file);
			setImageUrl(imageUrlUrl);
			changeImageForm.setValue('image', file);
		} else {
			setImageUrl(null);
			changeImageForm.setValue('image', undefined);
		}
	}

	return (
		<>
			<nav className='grid gap-4 text-muted-foreground'>
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
							className='grid gap-4'
						>
							<FormField
								control={changeUsernameForm.control}
								name='username'
								render={({ field }) => (
									<FormItem className='grid'>
										<FormLabel htmlFor='username' className='w-min text-lg'>
											Username
										</FormLabel>
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
								render={() => (
									<FormItem className='grid'>
										<FormLabel htmlFor='image' className='w-min text-lg'>
											Image
										</FormLabel>
										<div className='min-size-52 group relative size-52 rounded-md border'>
											{imageUrl ? (
												<FormLabel
													htmlFor='image'
													className='absolute bottom-2 right-2 z-10 flex h-10 cursor-pointer items-center rounded-md border border-input bg-background px-4 py-2 opacity-0 transition-opacity hover:bg-accent hover:text-accent-foreground group-hover:opacity-100'
												>
													Edit
												</FormLabel>
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
													required
													accept={`.jpg, .png, ${ACCEPTED_IMAGE_TYPES.join(', ')}`}
													onChange={(e) => handleImage(e.target.files?.[0])}
													className='hidden'
												/>
											</FormControl>
											{imageUrl && (
												<div className='absolute top-0 size-52 min-h-52 min-w-52'>
													<Image
														src={imageUrl}
														alt='Image imageUrl'
														className='aspect-square size-52 rounded-md object-cover'
														width={500}
														height={500}
													/>
												</div>
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
