'use client';

import { Bell, X } from 'lucide-react';
import { Button } from './ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from './ui/dropdown-menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification/notification.service';
import Link from 'next/link';
import { useNotificationsQuery } from '@/hooks/queries';

export default function Notifications() {
	const queryClient = useQueryClient();

	const notificationsQuery = useNotificationsQuery();
	const notifications = notificationsQuery.data?.data;

	const deleteNotificationMutation = useMutation({
		mutationFn: (notificationId: number) =>
			notificationService.delete(notificationId),
		onSuccess: () => {
			notificationsQuery.refetch();
		}
	});

	const deleteAllNotificationsMutation = useMutation({
		mutationFn: () => notificationService.deleteAll(),
		onSuccess: () => {
			queryClient.setQueryData(['notifications'], () => {
				return {
					data: []
				};
			});
		}
	});

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='icon'>
					<Bell className='size-5' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-96'>
				<DropdownMenuLabel className='flex justify-between'>
					<p>Notifications</p>
					{notifications?.length ? (
						<button
							onClick={() => {
								deleteAllNotificationsMutation.mutate();
							}}
							className='font-normal text-muted-foreground hover:text-foreground'
						>
							Delete all
						</button>
					) : null}
				</DropdownMenuLabel>
				{notifications?.length ? (
					notifications.map(({ notification }) => (
						<div key={notification.id}>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className='px-2 py-1.5'
								onSelect={(event) => event.preventDefault()}
							>
								<Link href={notification.link} className='w-full'>
									{notification.message}
								</Link>
								<Button
									variant='outline'
									size='icon'
									onClick={() => {
										deleteNotificationMutation.mutate(notification.id);
									}}
								>
									<X className='size-5' />
								</Button>
							</DropdownMenuItem>
						</div>
					))
				) : (
					<>
						<DropdownMenuSeparator />
						<div className='flex h-24 items-center justify-center text-sm'>
							You don't have any notifications
						</div>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
