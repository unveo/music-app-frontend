'use client';

import Link from 'next/link';
import {
	AlbumCard,
	CardSkeleton,
	ListeningHistoryCard,
	PlaylistCard,
	TrackCard,
	UserCard
} from './Cards';
import { useQuery } from '@tanstack/react-query';
import { listeningHistoryService } from '@/services/user/listening-history/listening-history.service';
import { userService } from '@/services/user/user.service';
import { playlistService } from '@/services/playlist/playlist.service';
import { trackService } from '@/services/track/track.service';
import { followService } from '@/services/user/follow/follow.service';
import { useCardsCountStore } from '@/stores/cards-count.store';
import { albumService } from '@/services/album/album.service';

export function Section({
	name,
	href,
	children
}: {
	name: string;
	href?: string;
	children: React.ReactNode;
}) {
	return (
		<li className='flex flex-col gap-4'>
			<div className='flex items-end justify-between'>
				<h2 className='text-xl font-semibold'>{name}</h2>
				{href ? (
					<Link href={href} className='text-muted-foreground'>
						Show all
					</Link>
				) : (
					<></>
				)}
			</div>
			<div>
				<ul className='grid grid-cols-3 grid-rows-1 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
					{children}
				</ul>
			</div>
		</li>
	);
}

export function SectionSkeleton() {
	const { cardsCount } = useCardsCountStore();
	let skeletons = Array(cardsCount).fill(0);

	return (
		<li className='flex flex-col gap-4'>
			<div className='flex items-end justify-between'>
				<div className='h-8 w-36 rounded-md bg-skeleton'></div>
				<div className='h-6 w-20 rounded-md bg-skeleton'></div>
			</div>
			<div>
				<ul className='grid grid-cols-3 grid-rows-1 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
					{skeletons.map((value, index) => (
						<CardSkeleton key={index}></CardSkeleton>
					))}
				</ul>
			</div>
		</li>
	);
}

export function ListeningHistorySection() {
	const { cardsCount } = useCardsCountStore();
	const listeningHistoryQuery = useQuery({
		queryKey: ['listening-history'],
		queryFn: () => listeningHistoryService.get(),
		refetchOnMount: false
	});
	const listeningHistory = listeningHistoryQuery.data?.data;

	if (listeningHistoryQuery.isLoading) {
		return <SectionSkeleton></SectionSkeleton>;
	}

	if (listeningHistory) {
		if (listeningHistory.length) {
			if (listeningHistory.length > cardsCount) {
				return (
					<Section href='/history' name='Listening history'>
						{listeningHistory.slice(0, cardsCount).map(({ track }) => (
							<ListeningHistoryCard
								key={track.id}
								track={track}
							></ListeningHistoryCard>
						))}
					</Section>
				);
			} else {
				return (
					<Section name='Listening history'>
						{listeningHistory.slice(0, cardsCount).map(({ track }) => (
							<ListeningHistoryCard
								key={track.id}
								track={track}
							></ListeningHistoryCard>
						))}
					</Section>
				);
			}
		} else {
			return <></>;
		}
	}
}

export function UsersSection() {
	const { cardsCount } = useCardsCountStore();
	const usersQuery = useQuery({
		queryKey: ['users'],
		queryFn: () => userService.getMany(7)
	});
	const users = usersQuery.data?.data;

	if (usersQuery.isLoading) {
		return <SectionSkeleton></SectionSkeleton>;
	}

	if (users) {
		if (users.length) {
			if (users.length > cardsCount) {
				return (
					<Section href='/users' name='Users'>
						{users.slice(0, cardsCount).map((user) => (
							<UserCard key={user.id} user={user}></UserCard>
						))}
					</Section>
				);
			} else {
				return (
					<Section name='Users'>
						{users.slice(0, cardsCount).map((user) => (
							<UserCard key={user.id} user={user}></UserCard>
						))}
					</Section>
				);
			}
		} else {
			return <></>;
		}
	}
}

export function GlobalPlaylistsSection() {
	const { cardsCount } = useCardsCountStore();
	const playlistsQuery = useQuery({
		queryKey: ['playlists'],
		queryFn: () => playlistService.getMany(undefined, 7)
	});
	const playlists = playlistsQuery.data?.data;

	if (playlistsQuery.isLoading) {
		return <SectionSkeleton></SectionSkeleton>;
	}

	if (playlists) {
		if (playlists.length) {
			if (playlists.length > cardsCount) {
				return (
					<Section href='/playlists' name='Playlists'>
						{playlists.slice(0, cardsCount).map((playlist) => (
							<PlaylistCard
								key={playlist.id}
								playlist={playlist}
							></PlaylistCard>
						))}
					</Section>
				);
			} else {
				return (
					<Section name='Playlists'>
						{playlists.slice(0, cardsCount).map((playlist) => (
							<PlaylistCard
								key={playlist.id}
								playlist={playlist}
							></PlaylistCard>
						))}
					</Section>
				);
			}
		} else {
			return <></>;
		}
	}
}

export function TracksSection({ username }: { username: string }) {
	const userQuery = useQuery({
		queryKey: ['user', username],
		queryFn: () => userService.getByName(username),
		retry: false
	});
	const user = userQuery.data?.data;
	const userId = user?.id;
	const { cardsCount } = useCardsCountStore();
	const tracksQuery = useQuery({
		queryKey: ['tracks', userId],
		queryFn: () => trackService.getMany(userId, 7),
		enabled: !!userId
	});
	const tracks = tracksQuery.data?.data;

	if (tracksQuery.isLoading) {
		return <SectionSkeleton></SectionSkeleton>;
	}

	if (tracks) {
		if (tracks.length) {
			if (tracks.length > cardsCount) {
				return (
					<Section href={`/${username}/tracks`} name='Tracks'>
						{tracks.slice(0, cardsCount).map((track) => (
							<TrackCard key={track.id} track={track}></TrackCard>
						))}
					</Section>
				);
			} else {
				return (
					<Section name='Tracks'>
						{tracks.slice(0, cardsCount).map((track) => (
							<TrackCard key={track.id} track={track}></TrackCard>
						))}
					</Section>
				);
			}
		} else {
			return <></>;
		}
	}
}

export function AlbumsSection({ username }: { username: string }) {
	const userQuery = useQuery({
		queryKey: ['user', username],
		queryFn: () => userService.getByName(username),
		retry: false
	});
	const user = userQuery.data?.data;
	const userId = user?.id;
	const { cardsCount } = useCardsCountStore();
	const albumsQuery = useQuery({
		queryKey: ['albums', userId],
		queryFn: () => albumService.getMany(userId, 7),
		enabled: !!userId
	});
	const albums = albumsQuery.data?.data;

	if (albumsQuery.isLoading) {
		return <SectionSkeleton></SectionSkeleton>;
	}

	if (albums) {
		if (albums.length) {
			if (albums.length > cardsCount) {
				return (
					<Section href={`/${username}/albums`} name='Albums'>
						{albums.slice(0, cardsCount).map((album) => (
							<AlbumCard key={album.id} album={album}></AlbumCard>
						))}
					</Section>
				);
			} else {
				return (
					<Section name='Albums'>
						{albums.slice(0, cardsCount).map((album) => (
							<AlbumCard key={album.id} album={album}></AlbumCard>
						))}
					</Section>
				);
			}
		} else {
			return <></>;
		}
	}
}

export function PlaylistsSection({ username }: { username: string }) {
	const userQuery = useQuery({
		queryKey: ['user', username],
		queryFn: () => userService.getByName(username),
		retry: false
	});
	const user = userQuery.data?.data;
	const userId = user?.id;
	const { cardsCount } = useCardsCountStore();
	const playlistsQuery = useQuery({
		queryKey: ['playlists', userId],
		queryFn: () => playlistService.getMany(userId, 7),
		enabled: !!userId
	});
	const playlists = playlistsQuery.data?.data;

	if (playlistsQuery.isLoading) {
		return <SectionSkeleton></SectionSkeleton>;
	}

	if (playlists) {
		if (playlists.length) {
			if (playlists.length > cardsCount) {
				return (
					<Section href={`/${username}/playlists`} name='Playlists'>
						{playlists.slice(0, cardsCount).map((playlist) => (
							<PlaylistCard
								key={playlist.id}
								playlist={playlist}
							></PlaylistCard>
						))}
					</Section>
				);
			} else {
				return (
					<Section name='Playlists'>
						{playlists.slice(0, cardsCount).map((playlist) => (
							<PlaylistCard
								key={playlist.id}
								playlist={playlist}
							></PlaylistCard>
						))}
					</Section>
				);
			}
		} else {
			return <></>;
		}
	}
}

export function FollowersSection({ username }: { username: string }) {
	const userQuery = useQuery({
		queryKey: ['user', username],
		queryFn: () => userService.getByName(username),
		retry: false
	});
	const user = userQuery.data?.data;
	const userId = user?.id;
	const { cardsCount } = useCardsCountStore();
	const followersQuery = useQuery({
		queryKey: ['followers', userId],
		queryFn: () => followService.getManyFollowers(userId!, 7),
		enabled: !!userId
	});
	const followers = followersQuery.data?.data;

	if (followersQuery.isLoading) {
		return <SectionSkeleton></SectionSkeleton>;
	}

	if (followers) {
		if (followers.length) {
			if (followers.length > cardsCount) {
				return (
					<Section href={`/${username}/followers`} name='Followers'>
						{followers.slice(0, cardsCount).map(({ follower }) => (
							<UserCard key={follower.id} user={follower}></UserCard>
						))}
					</Section>
				);
			} else {
				return (
					<Section name='Followers'>
						{followers.slice(0, cardsCount).map(({ follower }) => (
							<UserCard key={follower.id} user={follower}></UserCard>
						))}
					</Section>
				);
			}
		} else {
			return <></>;
		}
	}
}

export function FollowingSection({ username }: { username: string }) {
	const userQuery = useQuery({
		queryKey: ['user', username],
		queryFn: () => userService.getByName(username),
		retry: false
	});
	const user = userQuery.data?.data;
	const userId = user?.id;
	const { cardsCount } = useCardsCountStore();
	const followingQuery = useQuery({
		queryKey: ['following', userId],
		queryFn: () => followService.getManyFollowing(userId!, 7),
		enabled: !!userId
	});
	const following = followingQuery.data?.data;

	if (followingQuery.isLoading) {
		return <SectionSkeleton></SectionSkeleton>;
	}

	if (following) {
		if (following.length) {
			if (following.length > cardsCount) {
				return (
					<Section href={`/${username}/following`} name='Following'>
						{following.slice(0, cardsCount).map(({ following }) => (
							<UserCard key={following.id} user={following}></UserCard>
						))}
					</Section>
				);
			} else {
				return (
					<Section name='Following'>
						{following.slice(0, cardsCount).map(({ following }) => (
							<UserCard key={following.id} user={following}></UserCard>
						))}
					</Section>
				);
			}
		} else {
			return <></>;
		}
	}
}
