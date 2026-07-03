'use client';

import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IMAGES_URL, SMALL_IMAGE_ENDING } from '@/config';
import { useCurrentUserQuery } from '@/hooks/queries';
import { authService } from '@/services/auth/auth.service';
import { useTrackStore } from '@/stores/track.store';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from './ui/dropdown-menu';

export function UserDropdownMenu() {
	const audio = useTrackStore((state) => state.audio);

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

	const menuLabel = currentUser
		? `${currentUser.username} account menu`
		: 'Account menu';

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<button
					type='button'
					aria-label={menuLabel}
					className='size-8 min-h-8 min-w-8 overflow-hidden rounded-full bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
				>
					{currentUserQuery.isLoading ? null : (
						<Image
							src={`${IMAGES_URL}/${currentUser?.image}${SMALL_IMAGE_ENDING}`}
							width={32}
							height={32}
							alt=''
							className='aspect-square size-8 rounded-full object-cover'
						/>
					)}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-36'>
				<DropdownMenuItem asChild>
					<Link href={`/${currentUser?.username}`} className='w-full'>
						Profile
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href='/settings' className='w-full'>
						Settings
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => logoutMutation.mutate()}
					className='cursor-pointer focus:text-destructive'
				>
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
