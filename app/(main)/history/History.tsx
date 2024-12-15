'use client';

import { ListeningHistoryCard } from '@/components/Cards';
import { List, ListSkeleton } from '@/components/Lists';
import NotFound from '@/components/NotFound';
import { listeningHistoryService } from '@/services/user/listening-history/listening-history.service';
import { userService } from '@/services/user/user.service';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function History() {
	const currentUserQuery = useQuery({
		queryKey: ['current-user'],
		queryFn: () => userService.getCurrent()
	});
	const currentUser = currentUserQuery.data?.data;

	const listeningHistoryQuery = useQuery({
		queryKey: ['listening-history'],
		queryFn: () => listeningHistoryService.get(),
		refetchOnMount: false
	});
	const listeningHistory = listeningHistoryQuery.data?.data;

	if (listeningHistoryQuery.isLoading || currentUserQuery.isLoading) {
		return <ListSkeleton></ListSkeleton>;
	}

	if (listeningHistoryQuery.isError || currentUserQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (listeningHistory && currentUser) {
		if (listeningHistory.length) {
			return (
				<List username={currentUser.username} name='listening history'>
					{listeningHistory.map(({ track }) => (
						<ListeningHistoryCard
							key={track.id}
							track={track}
						></ListeningHistoryCard>
					))}
				</List>
			);
		} else {
			return (
				<div className='flex w-full max-w-[80rem] flex-grow items-center justify-center gap-5 p-8 text-5xl'>
					<Link href={`/${currentUser.username}`} className='font-semibold'>
						You
					</Link>
					<span>{`have nothing in your listening history`}</span>
				</div>
			);
		}
	}
}
