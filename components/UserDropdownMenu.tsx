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
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth/auth.service';
import { userService } from '@/services/user/user.service';

export function UserDropdownMenu() {
	const { push } = useRouter();
	const currentUserQuery = useQuery({
		queryKey: ['current-user'],
		queryFn: () => userService.getCurrent()
	});
	const currentUser = currentUserQuery.data?.data;
	const logoutMutation = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(),
		onSuccess: () => push('/login')
	});

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<button className='size-8 rounded-full bg-muted outline-none'>
					{currentUserQuery.isLoading ? (
						<></>
					) : (
						<Image
							src={`http:localhost:5000/${currentUser?.image}`}
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
