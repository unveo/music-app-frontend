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
import { FormProvider, useForm } from 'react-hook-form';
import { RegisterSchema, type RegisterDto } from '@/services/auth/auth.types';
import { authService } from '@/services/auth/auth.service';

export default function Signup() {
	const form = useForm<RegisterDto>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: { email: '', password: '', username: '' },
		mode: 'onSubmit'
	});
	const { push } = useRouter();
	const { mutate } = useMutation({
		mutationKey: ['register'],
		mutationFn: (data: RegisterDto) => authService.register(data),
		onSuccess: () => push('/')
	});
	function onSubmit(data: RegisterDto) {
		mutate(data);
	}

	return (
		<Card className='mx-auto w-[23rem]'>
			<CardHeader>
				<CardTitle className='text-xl'>Sign Up</CardTitle>
				<CardDescription>
					Enter your information to create an account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
						<FormField
							control={form.control}
							name='username'
							render={({ field }) => (
								<FormItem className='grid gap-2'>
									<FormLabel htmlFor='username'>Username</FormLabel>
									<FormControl>
										<div className='flex h-10 items-center rounded-md border border-border px-2'>
											<Input
												id='username'
												placeholder='username'
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
											/>{' '}
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
							Create an account
						</Button>
					</form>
				</FormProvider>
				<div className='mt-4 text-center text-sm'>
					Already have an account?{' '}
					<Link href='login' className='underline'>
						Login
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
