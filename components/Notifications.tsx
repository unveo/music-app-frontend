'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useNotificationsQuery } from '@/hooks/queries';
import { notificationService } from '@/services/notification/notification.service';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from './ui/alert-dialog';
import { Button } from './ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from './ui/dropdown-menu';

export default function Notifications() {
	const queryClient = useQueryClient();
	const [deleteAllOpen, setDeleteAllOpen] = useState(false);

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
			setDeleteAllOpen(false);
		}
	});

	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' size='icon' aria-label='Notifications'>
						<Bell className='size-5' aria-hidden='true' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='w-64 md:w-96'>
					<DropdownMenuLabel className='flex justify-between'>
						<p>Notifications</p>
						{notifications?.length ? (
							<button
								type='button'
								onClick={() => setDeleteAllOpen(true)}
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
									className='gap-2 px-2 py-1.5'
									onSelect={(event) => event.preventDefault()}
								>
									<Link
										href={notification.link}
										className='w-full overflow-hidden text-ellipsis'
									>
										{notification.message}
									</Link>
									<Button
										variant='outline'
										size='icon'
										aria-label={`Delete notification: ${notification.message}`}
										onClick={() => {
											deleteNotificationMutation.mutate(notification.id);
										}}
									>
										<X className='size-5' aria-hidden='true' />
									</Button>
								</DropdownMenuItem>
							</div>
						))
					) : (
						<>
							<DropdownMenuSeparator />
							<div className='flex h-24 items-center justify-center text-sm'>
								You don&apos;t have any notifications
							</div>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={deleteAllOpen} onOpenChange={setDeleteAllOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete all notifications?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently remove all notifications. You can&apos;t
							undo this action.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => deleteAllNotificationsMutation.mutate()}
						>
							Delete all
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
