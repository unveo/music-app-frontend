'use client';

import { UserCard } from '@/components/Cards';
import { List, ListSkeleton } from '@/components/Lists';
import NotFound from '@/components/NotFound';
import { followService } from '@/services/user/follow/follow.service';
import { userService } from '@/services/user/user.service';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function Following({ username }: { username: string }) {
	const userQuery = useQuery({
		queryKey: ['user', username],
		queryFn: () => userService.getByName(username),
		retry: false
	});
	const user = userQuery.data?.data;
	const userId = user?.id;
	const followingQuery = useQuery({
		queryKey: ['following', userId],
		queryFn: () => followService.getManyFollowing(userId!),
		enabled: !!userId
	});
	const following = followingQuery.data?.data;

	if (userQuery.isLoading) {
		return <></>;
	}

	if (userQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (followingQuery.isLoading) {
		return <ListSkeleton></ListSkeleton>;
	}

	if (following) {
		if (following.length) {
			return (
				<List username={username} name='is following'>
					{following.map(({ following }) => (
						<UserCard key={following.id} user={following}></UserCard>
					))}
				</List>
			);
		} else {
			return (
				<div className='flex w-full max-w-[80rem] flex-grow items-center justify-center gap-5 p-8 text-5xl'>
					<Link href={`/${username}`} className='font-semibold'>
						{`${username}`}
					</Link>
					<span>{`doesn't follow any user`}</span>
				</div>
			);
		}
	}
}
