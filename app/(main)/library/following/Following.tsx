'use client';

import { UserCard } from '@/components/Cards';
import { LibraryGridShell } from '@/components/LibraryGridShell';
import { useCurrentUserQuery, useFollowingQuery } from '@/hooks/queries';

export default function Following() {
	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const followingQuery = useFollowingQuery(currentUser?.id);
	const following = followingQuery.data?.data;

	const isLoading = currentUserQuery.isLoading || followingQuery.isLoading;
	const isError = currentUserQuery.isError || followingQuery.isError;

	return (
		<LibraryGridShell
			isLoading={isLoading}
			isError={isError}
			isEmpty={!following?.length}
			emptyMessage='You are not following anyone yet. Follow artists to see them here.'
		>
			<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
				{following?.map(({ following }) => (
					<UserCard key={following.id} user={following}></UserCard>
				))}
			</ul>
		</LibraryGridShell>
	);
}
