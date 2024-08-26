'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import {
	type UploadTrackDto,
	UploadTrackSchema
} from '@/services/track/track.types';
import { trackService } from '@/services/track/track.service';
import { userService } from '@/services/user/user.service';

export default function Upload() {
	const form = useForm<UploadTrackDto>({
		resolver: zodResolver(UploadTrackSchema),
		mode: 'onChange'
	});
	const { push } = useRouter();
	const currentUserQuery = useQuery({
		queryKey: ['current-user'],
		queryFn: () => userService.getCurrent()
	});
	const currentUser = currentUserQuery.data?.data;
	const { mutate } = useMutation({
		mutationKey: ['upload-track'],
		mutationFn: (formData: UploadTrackDto) => trackService.upload(formData),
		onSuccess: () => push(`/${currentUser ? currentUser.username : ''}`)
	});

	function onSubmit(dto: UploadTrackDto) {
		const formData = new FormData();
		formData.append('audio', dto.audio[0]);
		formData.append('image', dto.image[0]);
		formData.append('title', dto.title);
		formData.append('changeableId', dto.changeableId);
		mutate(formData as unknown as UploadTrackDto);
	}

	return (
		<Card className='w-96'>
			<CardHeader>
				<CardTitle className='text-xl'>Upload track</CardTitle>
			</CardHeader>
			<CardContent>
				<FormProvider {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='flex flex-col gap-2'
					>
						<Controller
							name='audio'
							control={form.control}
							rules={{ required: true }}
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor='audio'>Audio</FormLabel>
									<FormControl>
										<Input
											id='audio'
											type='file'
											required
											onChange={(e) => field.onChange(e.target.files)}
											className='flex items-center rounded-md border border-border p-2'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Controller
							name='image'
							control={form.control}
							rules={{ required: true }}
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor='image'>Image</FormLabel>
									<FormControl>
										<Input
											id='image'
											type='file'
											required
											onChange={(e) => field.onChange(e.target.files)}
											className='flex items-center rounded-md border border-border p-2'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Controller
							name='title'
							control={form.control}
							rules={{ required: true }}
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor='title'>Title</FormLabel>
									<FormControl>
										<Input
											id='title'
											type='text'
											required
											{...field}
											className='flex items-center rounded-md border border-border p-2'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Controller
							name='changeableId'
							control={form.control}
							rules={{ required: true }}
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor='changeableId'>Track id</FormLabel>
									<FormControl>
										<Input
											id='changeableId'
											type='text'
											required
											{...field}
											className='flex items-center rounded-md border border-border p-2'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit' className='mt-2 w-min'>
							Upload track
						</Button>
					</form>
				</FormProvider>
			</CardContent>
		</Card>
	);
}
