'use client';

import { TrackCard } from '@/components/Cards';
import { List } from '@/components/Lists';
import NotFound from '@/components/NotFound';
import { useTracksQuery, useUserQuery } from '@/hooks/queries';
import Link from 'next/link';

export default function Tracks({ username }: { username: string }) {
	const userQuery = useUserQuery(username);
	const user = userQuery.data?.data;

	const tracksQuery = useTracksQuery(user?.id);
	const tracks = tracksQuery.data?.data;

	if (userQuery.isLoading) {
		return null;
	}

	if (userQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (tracksQuery.isLoading) {
		return null;
	}

	if (tracks) {
		if (tracks.length) {
			return (
				<List username={username} name='tracks'>
					{tracks.map((track) => (
						<TrackCard key={track.id} track={track}></TrackCard>
					))}
				</List>
			);
		} else {
			return (
				<div className='flex w-full max-w-[80rem] flex-grow items-center justify-center gap-5 p-8 text-5xl'>
					<Link href={`/${username}`} className='font-semibold'>
						{`${username}`}
					</Link>
					<span>{`doesn't have any tracks`}</span>
				</div>
			);
		}
	}
}
