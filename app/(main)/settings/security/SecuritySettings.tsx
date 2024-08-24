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
import { authService } from '@/services/auth/auth.service';
import {
	ChangeEmailDto,
	ChangeEmailSchema,
	ChangePasswordDto,
	ChangePasswordSchema
} from '@/services/auth/auth.types';
import { userService } from '@/services/user/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export default function SecuritySettings() {
	const currentUserQuery = useQuery({
		queryKey: ['current-user'],
		queryFn: () => userService.getCurrent()
	});
	const currentUser = currentUserQuery.data?.data;
	const changeEmailForm = useForm<ChangeEmailDto>({
		resolver: zodResolver(ChangeEmailSchema),
		defaultValues: { email: currentUser?.email },
		mode: 'onChange',
		disabled: !currentUser
	});
	const changePasswordForm = useForm<ChangePasswordDto>({
		resolver: zodResolver(ChangePasswordSchema),
		defaultValues: { newPassword: '', oldPassword: '' },
		mode: 'onChange',
		disabled: !currentUser
	});
	const changeEmail = useMutation({
		mutationKey: ['change-email'],
		mutationFn: (dto: ChangeEmailDto) => authService.changeEmail(dto)
	});
	const changePassword = useMutation({
		mutationKey: ['change-password'],
		mutationFn: (dto: ChangePasswordDto) => authService.changePassword(dto)
	});

	useEffect(() => {
		if (currentUser) {
			changeEmailForm.setValue('email', currentUser.email);
		}
	}, [currentUser?.email]);

	return (
		<>
			<nav className='grid gap-4 text-muted-foreground'>
				<Link href='/settings/profile'>Profile</Link>
				<Link href='/settings/security' className='font-semibold text-primary'>
					Security
				</Link>
			</nav>
			<div className='grid gap-6'>
				<div className='rounded-md border bg-card p-6 text-card-foreground shadow-sm'>
					<FormProvider {...changeEmailForm}>
						<form
							onSubmit={changeEmailForm.handleSubmit((dto) =>
								changeEmail.mutate(dto)
							)}
							className='grid gap-4'
						>
							<FormField
								control={changeEmailForm.control}
								name='email'
								render={({ field }) => (
									<FormItem className='grid gap-2'>
										<FormLabel htmlFor='email' className='text-lg'>
											Email
										</FormLabel>
										<FormControl>
											<div className='flex h-10 items-center rounded-md border border-border px-2'>
												<Input id='email' required {...field} />
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
					<FormProvider {...changePasswordForm}>
						<form
							onSubmit={changePasswordForm.handleSubmit((dto) =>
								changePassword.mutate(dto)
							)}
							className='grid gap-4'
						>
							<FormLabel htmlFor='oldPassword' className='text-lg'>
								Password
							</FormLabel>
							<FormField
								control={changePasswordForm.control}
								name='oldPassword'
								render={({ field }) => (
									<FormItem className='grid gap-2'>
										<FormLabel htmlFor='oldPassword'>Old password</FormLabel>
										<FormControl>
											<div className='flex h-10 items-center rounded-md border border-border px-2'>
												<Input
													id='oldPassword'
													type='password'
													required
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={changePasswordForm.control}
								name='newPassword'
								render={({ field }) => (
									<FormItem className='grid gap-2'>
										<FormLabel htmlFor='newPassword'>New password</FormLabel>
										<FormControl>
											<div className='flex h-10 items-center rounded-md border border-border px-2'>
												<Input
													id='newPassword'
													type='password'
													required
													{...field}
												/>
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
			</div>
		</>
	);
}
