'use client';

import { TrackCard } from '@/components/Cards';
import { List, ListSkeleton } from '@/components/Lists';
import NotFound from '@/components/NotFound';
import { trackService } from '@/services/track/track.service';
import { userService } from '@/services/user/user.service';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function Tracks({ username }: { username: string }) {
	const userQuery = useQuery({
		queryKey: ['user', username],
		queryFn: () => userService.getByName(username),
		retry: false
	});
	const user = userQuery.data?.data;
	const userId = user?.id;
	const tracksQuery = useQuery({
		queryKey: ['tracks', userId],
		queryFn: () => trackService.getMany(userId),
		enabled: !!userId
	});
	const tracks = tracksQuery.data?.data;

	if (userQuery.isLoading) {
		return <></>;
	}

	if (userQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (tracksQuery.isLoading) {
		return <></>;
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
