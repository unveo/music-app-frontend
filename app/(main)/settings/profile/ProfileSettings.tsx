'use client';

import { Button } from '@/components/ui/button';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { userService } from '@/services/user/user.service';
import { UpdateUserDto, UpdateUserSchema } from '@/services/user/user.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export default function ProfileSettings() {
	const currentUserQuery = useQuery({
		queryKey: ['current-user'],
		queryFn: () => userService.getCurrent()
	});
	const currentUser = currentUserQuery.data?.data;

	const changeUsernameForm = useForm<UpdateUserDto>({
		resolver: zodResolver(UpdateUserSchema),
		defaultValues: { username: currentUser?.username },
		mode: 'onChange',
		disabled: !currentUser
	});
	const changeImageForm = useForm<UpdateUserDto>({
		// TODO
		resolver: zodResolver(UpdateUserSchema),
		defaultValues: { image: '' },
		mode: 'onSubmit',
		disabled: !currentUser
	});
	const changeUsernameMutation = useMutation({
		mutationKey: ['change-username'],
		mutationFn: (dto: UpdateUserDto) => userService.update(dto),
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
		mutationFn: (dto: UpdateUserDto) => userService.update(dto),
		onSuccess: () => {
			toast({ title: 'Image updated' });
			currentUserQuery.refetch();
		},
		onError: (error) => {
			toast({ title: `${error.message}`, variant: 'destructive' });
		}
	});
	const { toast } = useToast();

	useEffect(() => {
		if (currentUser) {
			changeUsernameForm.setValue('username', currentUser.username);
		}
	}, [currentUser?.username]);

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
							onSubmit={changeUsernameForm.handleSubmit((dto) =>
								changeUsernameMutation.mutate(dto)
							)}
							className='grid gap-4'
						>
							<FormField
								control={changeUsernameForm.control}
								name='username'
								render={({ field }) => (
									<FormItem className='grid gap-2'>
										<FormLabel htmlFor='username' className='text-lg'>
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
					<FormProvider {...changeImageForm}>
						<form
							onSubmit={changeImageForm.handleSubmit((dto) =>
								changeImageMutation.mutate(dto)
							)}
							className='grid gap-4'
						>
							<FormField
								control={changeImageForm.control}
								name='image'
								render={({ field }) => (
									<FormItem className='grid gap-2'>
										<FormLabel htmlFor='image' className='text-lg'>
											Image
										</FormLabel>
										<FormControl>
											<Input
												type='file'
												id='image'
												required
												{...field}
												className='flex h-min items-center rounded-md border border-border p-2'
											/>
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
			</div>
		</>
	);
}
