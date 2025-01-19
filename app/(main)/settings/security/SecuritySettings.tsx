'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useCurrentUserQuery } from '@/hooks/queries';
import { authService } from '@/services/auth/auth.service';
import {
	type ChangeEmailDto,
	ChangeEmailSchema,
	type ChangePasswordDto,
	ChangePasswordSchema
} from '@/services/auth/auth.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

export default function SecuritySettings() {
	const { toast } = useToast();

	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const changeEmailForm = useForm<ChangeEmailDto>({
		resolver: zodResolver(ChangeEmailSchema),
		defaultValues: { email: '' },
		disabled: !currentUser
	});

	const changePasswordForm = useForm<ChangePasswordDto>({
		resolver: zodResolver(ChangePasswordSchema),
		defaultValues: { newPassword: '', oldPassword: '' },
		disabled: !currentUser
	});

	const changeEmail = useMutation({
		mutationFn: (dto: ChangeEmailDto) => authService.changeEmail(dto),
		onSuccess: () => {
			toast({ title: 'Email updated' });
		}
	});

	const changePassword = useMutation({
		mutationFn: (dto: ChangePasswordDto) => authService.changePassword(dto),
		onSuccess: () => {
			changePasswordForm.reset();
			toast({ title: 'Password updated' });
		}
	});

	return (
		<>
			<nav className='grid gap-4 text-lg text-muted-foreground'>
				<Link href='/settings/profile'>Profile</Link>
				<Link href='/settings/security' className='font-semibold text-primary'>
					Security
				</Link>
			</nav>
			<div className='grid gap-6'>
				<div className='rounded-md border bg-card p-6 text-card-foreground shadow-sm'>
					<form
						onSubmit={changeEmailForm.handleSubmit((dto) =>
							changeEmail.mutate(dto)
						)}
						className='grid gap-4'
					>
						<div className='grid gap-2'>
							<div className='flex items-end justify-between gap-4 truncate'>
								<Label htmlFor='email' className='text-lg'>
									Email
								</Label>
								{currentUser?.email ? (
									<div className='truncate text-end text-zinc-400'>
										<p className='hidden sm:inline'>
											Current email: {currentUser?.email}
										</p>
										<p className='sm:hidden'>{currentUser?.email}</p>
									</div>
								) : null}
							</div>
							<div className='flex h-10 items-center rounded-md border border-border px-2'>
								<Input
									id='email'
									required
									{...changeEmailForm.register('email')}
								/>
							</div>
							{changeEmailForm.formState.errors.email && (
								<p className='text-sm text-destructive'>
									{changeEmailForm.formState.errors.email.message}
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
						onSubmit={changePasswordForm.handleSubmit((dto) =>
							changePassword.mutate(dto)
						)}
						className='grid gap-4'
					>
						<Label htmlFor='oldPassword' className='text-lg'>
							Password
						</Label>
						<div className='grid gap-2'>
							<Label htmlFor='oldPassword'>Old password</Label>
							<div className='flex h-10 items-center rounded-md border border-border px-2'>
								<Input
									id='oldPassword'
									type='password'
									required
									{...changePasswordForm.register('oldPassword')}
								/>
							</div>
							{changePasswordForm.formState.errors.oldPassword && (
								<p className='text-sm text-destructive'>
									{changePasswordForm.formState.errors.oldPassword.message}
								</p>
							)}
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='newPassword'>New password</Label>
							<div className='flex h-10 items-center rounded-md border border-border px-2'>
								<Input
									id='newPassword'
									type='password'
									required
									{...changePasswordForm.register('newPassword')}
								/>
							</div>
							{changePasswordForm.formState.errors.newPassword && (
								<p className='text-sm text-destructive'>
									{changePasswordForm.formState.errors.newPassword.message}
								</p>
							)}
						</div>
						<Button disabled={!currentUser} type='submit' className='w-min'>
							Save
						</Button>
					</form>
				</div>
			</div>
		</>
	);
}
