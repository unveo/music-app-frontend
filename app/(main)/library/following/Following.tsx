'use client';

import { UserCard } from '@/components/Cards';
import { useCurrentUserQuery, useFollowingQuery } from '@/hooks/queries';
import Link from 'next/link';

export default function Following() {
	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const followingQuery = useFollowingQuery(currentUser?.id);
	const following = followingQuery.data?.data;

	return (
		<div className='flex flex-col gap-4 p-8'>
			<nav className='flex gap-6 text-2xl font-semibold text-muted-foreground'>
				<Link href='/library/tracks'>Liked Tracks</Link>
				<Link href='/library/playlists'>Playlists</Link>
				<Link href='/library/albums'>Albums</Link>
				<Link href='/library/history'>History</Link>
				<Link href='/library/following' className='text-primary'>
					Following
				</Link>
			</nav>
			<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
				{following &&
					following.map(({ following }) => (
						<UserCard key={following.id} user={following}></UserCard>
					))}
			</ul>
		</div>
	);
}
