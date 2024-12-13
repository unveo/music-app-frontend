'use client';

import { UserCard } from '@/components/Cards';
import { List, ListSkeleton } from '@/components/Lists';
import NotFound from '@/components/NotFound';
import { followService } from '@/services/user/follow/follow.service';
import { userService } from '@/services/user/user.service';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function Followers({ username }: { username: string }) {
	const userQuery = useQuery({
		queryKey: ['user', username],
		queryFn: () => userService.getByName(username),
		retry: false
	});
	const user = userQuery.data?.data;
	const userId = user?.id;
	const followersQuery = useQuery({
		queryKey: ['followers', userId],
		queryFn: () => followService.getManyFollowers(userId!),
		enabled: !!userId
	});
	const followers = followersQuery.data?.data;

	if (userQuery.isLoading) {
		return <></>;
	}

	if (userQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (followersQuery.isLoading) {
		return <ListSkeleton></ListSkeleton>;
	}

	if (followers) {
		if (followers.length) {
			return (
				<List username={username} name='followers'>
					{followers.map(({ follower }) => (
						<UserCard key={follower.id} user={follower}></UserCard>
					))}
				</List>
			);
		} else {
			return (
				<div className='flex w-full max-w-[80rem] flex-grow items-center justify-center gap-5 p-8 text-5xl'>
					<Link href={`/${username}`} className='font-semibold'>
						{`${username}`}
					</Link>
					<span>{`doesn't have any followers`}</span>
				</div>
			);
		}
	}
}
