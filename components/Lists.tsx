'use client';

import { useQuery } from '@tanstack/react-query';
import {
	AlbumCard,
	CardSkeleton,
	ListeningHistoryCard,
	PlaylistCard,
	TrackCard,
	UserCard
} from './Cards';
import { userService } from '@/services/user/user.service';
import { trackService } from '@/services/track/track.service';
import Link from 'next/link';
import NotFound from './NotFound';
import { playlistService } from '@/services/playlist/playlist.service';
import { albumService } from '@/services/album/album.service';
import { followService } from '@/services/user/follow/follow.service';
import { listeningHistoryService } from '@/services/user/listening-history/listening-history.service';

export function List({
	username,
	name,
	children
}: {
	username: string;
	name: string;
	children: React.ReactNode;
}) {
	return (
		<div className='flex flex-col gap-4 p-8'>
			<div className='flex items-end'>
				<h2 className='text-2xl'>
					<Link href='./' className='font-semibold'>
						{username}
					</Link>
					<span>{` ${name}`}</span>
				</h2>
			</div>
			<div>
				<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
					{children}
				</ul>
			</div>
		</div>
	);
}

export function ListSkeleton() {
	const cards = Array(18).fill(0);

	return (
		<div className='flex flex-col gap-4 p-8'>
			<div className='flex items-end'>
				<div className='h-8 w-36 rounded-md bg-skeleton'></div>
			</div>
			<div>
				<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
					{cards.map((value, index) => (
						<CardSkeleton key={index}></CardSkeleton>
					))}
				</ul>
			</div>
		</div>
	);
}

export function TracksList({ username }: { username: string }) {
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
		return <ListSkeleton></ListSkeleton>;
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

export function PlaylistsList({ username }: { username: string }) {
	const userQuery = useQuery({
		queryKey: ['user', username],
		queryFn: () => userService.getByName(username),
		retry: false
	});
	const user = userQuery.data?.data;
	const userId = user?.id;
	const playlistsQuery = useQuery({
		queryKey: ['playlists', userId],
		queryFn: () => playlistService.getMany(userId),
		enabled: !!userId
	});
	const playlists = playlistsQuery.data?.data;

	if (userQuery.isLoading) {
		return <></>;
	}

	if (userQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (playlistsQuery.isLoading) {
		return <ListSkeleton></ListSkeleton>;
	}

	if (playlists) {
		if (playlists.length) {
			return (
				<List username={username} name='playlists'>
					{playlists.map((playlist) => (
						<PlaylistCard key={playlist.id} playlist={playlist}></PlaylistCard>
					))}
				</List>
			);
		} else {
			return (
				<div className='flex w-full max-w-[80rem] flex-grow items-center justify-center gap-5 p-8 text-5xl'>
					<Link href={`/${username}`} className='font-semibold'>
						{`${username}`}
					</Link>
					<span>{`doesn't have any playlists`}</span>
				</div>
			);
		}
	}
}

export function AlbumsList({ username }: { username: string }) {
	const userQuery = useQuery({
		queryKey: ['user', username],
		queryFn: () => userService.getByName(username),
		retry: false
	});
	const user = userQuery.data?.data;
	const userId = user?.id;
	const albumsQuery = useQuery({
		queryKey: ['albums', userId],
		queryFn: () => albumService.getMany(userId),
		enabled: !!userId
	});
	const albums = albumsQuery.data?.data;

	if (userQuery.isLoading) {
		return <></>;
	}

	if (userQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (albumsQuery.isLoading) {
		return <ListSkeleton></ListSkeleton>;
	}

	if (albums) {
		if (albums.length) {
			return (
				<List username={username} name='albums'>
					{albums.map((album) => (
						<AlbumCard key={album.id} album={album}></AlbumCard>
					))}
				</List>
			);
		} else {
			return (
				<div className='flex w-full max-w-[80rem] flex-grow items-center justify-center gap-5 p-8 text-5xl'>
					<Link href={`/${username}`} className='font-semibold'>
						{`${username}`}
					</Link>
					<span>{`doesn't have any albums`}</span>
				</div>
			);
		}
	}
}

export function FollowersList({ username }: { username: string }) {
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

export function FollowingList({ username }: { username: string }) {
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

export function HistoryList() {
	const currentUserQuery = useQuery({
		queryKey: ['current-user'],
		queryFn: () => userService.getCurrent()
	});
	const currentUser = currentUserQuery.data?.data;

	const listeningHistoryQuery = useQuery({
		queryKey: ['listening-history'],
		queryFn: () => listeningHistoryService.get()
	});
	const listeningHistory = listeningHistoryQuery.data?.data;

	if (listeningHistoryQuery.isLoading || currentUserQuery.isLoading) {
		return <ListSkeleton></ListSkeleton>;
	}

	if (listeningHistoryQuery.isError || currentUserQuery.isError) {
		return <NotFound></NotFound>;
	}

	if (listeningHistory && currentUser) {
		if (listeningHistory.length) {
			return (
				<List username={currentUser.username} name='listening history'>
					{listeningHistory.map(({ track }) => (
						<ListeningHistoryCard
							key={track.id}
							track={track}
						></ListeningHistoryCard>
					))}
				</List>
			);
		} else {
			return (
				<div className='flex w-full max-w-[80rem] flex-grow items-center justify-center gap-5 p-8 text-5xl'>
					<Link href={`/${currentUser.username}`} className='font-semibold'>
						You
					</Link>
					<span>{`have nothing in your listening history`}</span>
				</div>
			);
		}
	}
}
