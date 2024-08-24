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

export default function Login() {
  const form = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit'
  });
  const { push } = useRouter();
  const { mutate } = useMutation({
    mutationKey: ['login'],
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: () => push('/')
  });
  function onSubmit(data: LoginDto) {
    mutate(data);
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-xl'>Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
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
                      <Input id='password' type='password' {...field} />
                    </div>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full'>
              Login
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
