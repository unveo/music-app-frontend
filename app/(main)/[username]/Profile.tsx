'use client';

import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import {
	AlbumsSection,
	FollowersSection,
	FollowingSection,
	PlaylistsSection,
	TracksSection
} from '@/components/Sections';
import { nFormatter } from '@/lib/utils';
import { followService } from '@/services/user/follow/follow.service';
import NotFound from '@/components/NotFound';
import useCardsCount from '@/hooks/cards-count';
import { baseUrl, LARGE_IMAGE_ENDING } from '@/config';
import {
	useCurrentUserQuery,
	useFollowersQuery,
	useIsFollowedQuery,
	useTracksQuery,
	useUserQuery
} from '@/hooks/queries';
import { UserHero } from '@/components/Heroes';
import { PlayUserButton } from '@/components/PlayButtons';

export default function Profile({ username }: { username: string }) {
	useCardsCount();

	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const userQuery = useUserQuery(username);
	const user = userQuery.data?.data;
	const userId = user?.id;
	const isCurrentUser = currentUser?.id === userId;

	const isFollowedQuery = useIsFollowedQuery(isCurrentUser, userId);
	const isFollowed = isFollowedQuery.data?.data;

	const followersQuery = useFollowersQuery(userId, 7);

	const tracksQuery = useTracksQuery(userId, 7);
	const tracks = tracksQuery.data?.data;

	const followMutation = useMutation({
		mutationFn: () => followService.follow(userId!),
		onSuccess: () => {
			userQuery.refetch();
			isFollowedQuery.refetch();
			followersQuery.refetch();
		}
	});
	const unfollowMutation = useMutation({
		mutationFn: () => followService.unfollow(userId!),
		onSuccess: () => {
			userQuery.refetch();
			isFollowedQuery.refetch();
			followersQuery.refetch();
		}
	});

	if (userQuery.isLoading) {
		return null;
	}

	if (userQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (!user) {
		return null;
	}

	return (
		<>
			<UserHero user={user}></UserHero>
			<div className='flex flex-col gap-8 px-8 py-6'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						{tracks?.length ? (
							<PlayUserButton track={tracks[0]} variant='set'></PlayUserButton>
						) : null}
						{isCurrentUser ? null : isFollowed ? (
							<Button onClick={() => unfollowMutation.mutate()}>
								Unfollow
							</Button>
						) : (
							<Button onClick={() => followMutation.mutate()} variant='outline'>
								Follow
							</Button>
						)}
					</div>
					<div className='flex gap-3'>
						<span>{`${nFormatter(user._count.followers)} Followers`}</span>
						<span>{`${nFormatter(user._count.following)} Following`}</span>
					</div>
				</div>
				<ul className='flex flex-col gap-12'>
					<TracksSection username={username}></TracksSection>
					<AlbumsSection username={username}></AlbumsSection>
					<PlaylistsSection username={username}></PlaylistsSection>
					<FollowersSection username={username}></FollowersSection>
					<FollowingSection username={username}></FollowingSection>
				</ul>
			</div>
		</>
	);
}
