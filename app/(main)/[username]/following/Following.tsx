'use client';

import { UserCard } from '@/components/Cards';
import { List } from '@/components/Lists';
import NotFound from '@/components/NotFound';
import { useFollowingQuery, useUserQuery } from '@/hooks/queries';
import Link from 'next/link';

export default function Following({ username }: { username: string }) {
	const userQuery = useUserQuery(username);
	const user = userQuery.data?.data;

	const followingQuery = useFollowingQuery(user?.id);
	const following = followingQuery.data?.data;

	if (userQuery.isLoading) {
		return null;
	}

	if (userQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (followingQuery.isLoading) {
		return null;
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
