'use client';

import { Button } from '@/components/ui/button';
import {
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormField,
	Form
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import {
	type UploadTrackDto,
	UploadTrackSchema
} from '@/services/track/track.types';
import { trackService } from '@/services/track/track.service';
import { userService } from '@/services/user/user.service';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';

export default function UploadAlbum() {
	const [audioPreview, setAudioPreview] = useState<string | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const { toast } = useToast();

	const currentUserQuery = useQuery({
		queryKey: ['current-user'],
		queryFn: () => userService.getCurrent()
	});
	const currentUser = currentUserQuery.data?.data;

	const uploadForm = useForm<UploadTrackDto>({
		resolver: zodResolver(UploadTrackSchema),
		defaultValues: {
			audio: undefined,
			image: undefined,
			changeableId: '',
			title: ''
		},
		mode: 'onChange',
		disabled: !currentUser
	});

	const uploadMutation = useMutation({
		mutationKey: ['upload-track'],
		mutationFn: (dto: FormData) =>
			trackService.upload(dto as unknown as UploadTrackDto),
		onSuccess: () => {
			toast({ title: 'Track uploaded' });
			URL.revokeObjectURL(audioPreview!);
			URL.revokeObjectURL(imagePreview!);
			setAudioPreview(null);
			setImagePreview(null);
			uploadForm.setValue('image', undefined); // TODO
			uploadForm.setValue('audio', undefined); // TODO
		},
		onError: (error) => {
			toast({ title: `${error.message}`, variant: 'destructive' });
		}
	});

	function onSubmit(dto: UploadTrackDto) {
		const formData = new FormData();
		formData.append('title', dto.title);
		formData.append('changeableId', dto.changeableId);
		formData.append('audio', dto.audio);
		formData.append('image', dto.image);
		uploadMutation.mutate(formData);
	}

	function handleAudio(file?: File) {
		if (file) {
			const previewUrl = URL.createObjectURL(file);
			setAudioPreview(previewUrl);
			uploadForm.setValue('audio', file);
		} else {
			setAudioPreview(null);
			uploadForm.setValue('audio', undefined);
		}
	}
	function handleImage(file?: File) {
		if (file) {
			const previewUrl = URL.createObjectURL(file);
			setImagePreview(previewUrl);
			uploadForm.setValue('image', file);
		} else {
			setImagePreview(null);
			uploadForm.setValue('image', undefined);
		}
	}

	return (
		<>
			<nav className='grid gap-4 text-muted-foreground'>
				<Link href='/upload/track'>Track</Link>
				<Link href='/upload/album' className='font-semibold text-primary'>
					Album
				</Link>
			</nav>
			<div className='grid gap-6'>
				<div className='rounded-md border bg-card p-6 text-card-foreground shadow-sm'></div>
			</div>
		</>
	);
}
