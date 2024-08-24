'use client';

import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
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
import { userService } from '@/services/user/user.service';
import useCardsCount from '@/hooks/cards-count.hook';
import NotFound from '@/components/NotFound';

export default function Profile({ username }: { username: string }) {
	useCardsCount();
	const currentUserQuery = useQuery({
		queryKey: ['current-user'],
		queryFn: () => userService.getCurrent()
	});
	const currentUser = currentUserQuery.data?.data;
	const userQuery = useQuery({
		queryKey: ['user', username],
		queryFn: () => userService.getByName(username),
		retry: false
	});
	const user = userQuery.data?.data;
	const userId = user?.id;
	const isCurrentUser = currentUser?.id === userId;
	const isFollowedQuery = useQuery({
		queryKey: ['is-followed', userId],
		queryFn: () => followService.check(userId as number),
		enabled: !!userId
	});
	const isFollowed = isFollowedQuery.data?.data;
	const followersQuery = useQuery({
		queryKey: ['followers', userId],
		queryFn: () => followService.getManyFollowers(userId as number, 6),
		enabled: !!userId
	});
	const followMutation = useMutation({
		mutationKey: ['follow', userId],
		mutationFn: () => followService.follow(userId as number),
		onSuccess: () => {
			userQuery.refetch();
			isFollowedQuery.refetch();
			followersQuery.refetch();
		}
	});
	const unfollowMutation = useMutation({
		mutationKey: ['unfollow', userId],
		mutationFn: () => followService.unfollow(userId as number),
		onSuccess: () => {
			userQuery.refetch();
			isFollowedQuery.refetch();
			followersQuery.refetch();
		}
	});

	if (userQuery.isLoading) {
		return <></>;
	}

	if (userQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (user) {
		return (
			<>
				<div className='flex bg-skeleton p-6'>
					<div className='flex gap-4'>
						<div className='p-4'>
							<button className='size-52 rounded-full border shadow-sm'>
								<Image
									alt='avatar'
									src={`http:localhost:5000/${user.image}`}
									width={320}
									height={320}
									className='rounded-full'
								></Image>
							</button>
						</div>
						<div className='flex items-center'>
							<span className='text-2xl font-semibold'>{user.username}</span>
						</div>
					</div>
				</div>
				<div className='flex flex-col gap-6 px-8 py-6'>
					<div className='flex h-10 items-center justify-between'>
						{isCurrentUser ? (
							<div></div>
						) : isFollowed ? (
							<Button onClick={() => unfollowMutation.mutate()}>
								Unfollow
							</Button>
						) : (
							<Button
								onClick={() => followMutation.mutate()}
								variant='secondary'
								className='border shadow-sm'
							>
								Follow
							</Button>
						)}
						<div className='flex gap-3'>
							<span>{`${nFormatter(user._count.followers as number)} Followers`}</span>
							<span>{`${nFormatter(user._count.following as number)} Following`}</span>
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
}
