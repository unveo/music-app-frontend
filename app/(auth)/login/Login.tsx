'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent
} from '@/components/ui/card';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useForm, FormProvider } from 'react-hook-form';
import { type LoginDto, LoginSchema } from '@/services/auth/auth.types';
import { authService } from '@/services/auth/auth.service';
import { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';

export default function Login() {
	const { push } = useRouter();
	const { toast } = useToast();

	const form = useForm<LoginDto>({
		resolver: zodResolver(LoginSchema),
		defaultValues: { email: '', password: '' },
		mode: 'onSubmit'
	});

	const loginMutation = useMutation({
		mutationFn: (data: LoginDto) => authService.login(data),
		onSuccess: () => push('/'),
		onError: (error: any) => {
			if (error.status !== 400) {
				toast({
					title: error.response.data.message,
					variant: 'destructive'
				});
			}
		}
	});

	const newVerificationMutation = useMutation({
		mutationFn: (data: LoginDto) => authService.newVerification(data),
		onError: () => {
			toast({
				title: 'Too many requests. Try again later',
				variant: 'destructive'
			});
		}
	});

	function onSubmit(data: LoginDto) {
		loginMutation.mutate(data);
	}

	if (newVerificationMutation.isSuccess) {
		return (
			<Card className='mx-auto w-[23rem]'>
				<CardHeader>
					<CardTitle className='text-xl'>Verification</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Verification link has been sent to {form.getValues().email}</p>
					<button
						onClick={() =>
							newVerificationMutation.mutate({
								email: form.getValues().email,
								password: form.getValues().password
							})
						}
						className='mt-2 text-sm underline'
					>
						Send new link
					</button>
				</CardContent>
			</Card>
		);
	}

	if (loginMutation.isError) {
		const error = loginMutation.error as AxiosError;

		if (error.status === 400) {
			return (
				<Card className='mx-auto w-[23rem]'>
					<CardHeader>
						<CardTitle className='text-xl'>Verification</CardTitle>
					</CardHeader>
					<CardContent>
						<p>You are not verified. Check your email</p>
						<button
							onClick={() =>
								newVerificationMutation.mutate({
									email: form.getValues().email,
									password: form.getValues().password
								})
							}
							className='mt-2 text-sm underline'
						>
							Send new link
						</button>
					</CardContent>
				</Card>
			);
		}
	}

	return (
		<Card className='mx-auto w-[23rem]'>
			<CardHeader>
				<CardTitle className='text-xl'>Login</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<FormProvider {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						noValidate
						className='grid gap-4'
					>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem className='grid gap-2'>
									<FormLabel htmlFor='email'>Email</FormLabel>
									<FormControl>
										<div className='flex h-10 items-center rounded-md border border-border px-2'>
											<Input
												id='email'
												type='email'
												placeholder='m@example.com'
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
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem className='grid gap-2'>
									<FormLabel htmlFor='password'>Password</FormLabel>
									<FormControl>
										<div className='flex h-10 items-center rounded-md border border-border px-2'>
											<Input
												id='password'
												type='password'
												required
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage></FormMessage>
								</FormItem>
							)}
						/>
						<Button type='submit' className='w-full'>
							Login
						</Button>
						<Button
							onClick={() => {
								form.setValue('email', 'guest@musicapp.fun');
								form.setValue('password', 'guest');
								loginMutation.mutate(form.getValues());
							}}
							type='button'
							variant='outline'
							className='w-full'
						>
							Login as guest
						</Button>
					</form>
				</FormProvider>
				<div className='mt-4 text-center text-sm'>
					Don&apos;t have an account?{' '}
					<Link href='signup' className='underline'>
						Sign up
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
