'use client';

import { UserCard } from '@/components/Cards';
import { useCurrentUserQuery, useFollowingQuery } from '@/hooks/queries';

export default function Following() {
	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const followingQuery = useFollowingQuery(currentUser?.id);
	const following = followingQuery.data?.data;

	return (
		<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
			{following?.map(({ following }) => (
				<UserCard key={following.id} user={following}></UserCard>
			))}
		</ul>
	);
}
