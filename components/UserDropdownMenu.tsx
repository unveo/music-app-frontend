'use client';

import Image from 'next/image';
import {
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuSeparator
} from './ui/dropdown-menu';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth/auth.service';
import { IMAGES_URL, SMALL_IMAGE_ENDING } from '@/config';
import { useCurrentUserQuery } from '@/hooks/queries';
import { useTrackStore } from '@/stores/track.store';

export function UserDropdownMenu() {
	const { audio } = useTrackStore();

	const { push } = useRouter();

	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const logoutMutation = useMutation({
		mutationFn: () => authService.logout(),
		onSuccess: () => {
			audio?.pause();
			push('/login');
		}
	});

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<button className='size-8 min-h-8 min-w-8 rounded-full bg-muted outline-none'>
					{currentUserQuery.isLoading ? null : (
						<Image
							src={`${IMAGES_URL}/${currentUser?.image}${SMALL_IMAGE_ENDING}`}
							width={100}
							height={100}
							alt='avatar'
							className='aspect-square rounded-full object-cover'
						/>
					)}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem>
					<Link
						href={`/${currentUser?.username}`}
						className='h-full w-full px-2 py-1.5'
					>
						Profile
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Link href='/settings' className='h-full w-full px-2 py-1.5'>
						Settings
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<button
						className='h-full w-full px-2 py-1.5 text-left'
						onClick={() => logoutMutation.mutate()}
					>
						Log out
					</button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
