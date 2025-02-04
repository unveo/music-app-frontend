'use client';

import Link from 'next/link';
import {
	AlbumCardProfile,
	PlaylistCardProfile,
	TrackCard,
	UserCard
} from './Cards';
import { useCardsCountStore } from '@/stores/cards-count.store';
import {
	useAlbumsQuery,
	useFollowersQuery,
	useFollowingQuery,
	usePlaylistsQuery,
	useRecommendedQuery,
	useTracksQuery,
	useUserQuery
} from '@/hooks/queries';

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
				) : null}
			</div>
			<div>
				<ul
					className={`grid grid-cols-3 grid-rows-1 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6`}
				>
					{children}
				</ul>
			</div>
		</li>
	);
}

export function RecommendedSection() {
	const recommendedQuery = useRecommendedQuery();
	const recommended = recommendedQuery.data?.data;

	if (!recommended?.length) {
		return null;
	}

	return (
		<Section name='Recommended'>
			{recommended.map((user) => (
				<UserCard key={user.id} user={user}></UserCard>
			))}
		</Section>
	);
}

export function TracksSection({ username }: { username: string }) {
	const { cardsCount } = useCardsCountStore();

	const userQuery = useUserQuery(username);
	const user = userQuery.data?.data;

	const tracksQuery = useTracksQuery(user?.id, 7);
	const tracks = tracksQuery.data?.data;

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
			return null;
		}
	}
}

export function AlbumsSection({ username }: { username: string }) {
	const { cardsCount } = useCardsCountStore();

	const userQuery = useUserQuery(username);
	const user = userQuery.data?.data;

	const albumsQuery = useAlbumsQuery(user?.id, 7);
	const albums = albumsQuery.data?.data;

	if (albums) {
		if (albums.length) {
			if (albums.length > cardsCount) {
				return (
					<Section href={`/${username}/albums`} name='Albums'>
						{albums.slice(0, cardsCount).map((album) => (
							<AlbumCardProfile key={album.id} album={album}></AlbumCardProfile>
						))}
					</Section>
				);
			} else {
				return (
					<Section name='Albums'>
						{albums.slice(0, cardsCount).map((album) => (
							<AlbumCardProfile key={album.id} album={album}></AlbumCardProfile>
						))}
					</Section>
				);
			}
		} else {
			return null;
		}
	}
}

export function PlaylistsSection({ username }: { username: string }) {
	const { cardsCount } = useCardsCountStore();

	const userQuery = useUserQuery(username);
	const user = userQuery.data?.data;

	const playlistsQuery = usePlaylistsQuery(user?.id, 7);
	const playlists = playlistsQuery.data?.data;

	if (playlists) {
		if (playlists.length) {
			if (playlists.length > cardsCount) {
				return (
					<Section href={`/${username}/playlists`} name='Playlists'>
						{playlists.slice(0, cardsCount).map((playlist) => (
							<PlaylistCardProfile
								key={playlist.id}
								playlist={playlist}
							></PlaylistCardProfile>
						))}
					</Section>
				);
			} else {
				return (
					<Section name='Playlists'>
						{playlists.slice(0, cardsCount).map((playlist) => (
							<PlaylistCardProfile
								key={playlist.id}
								playlist={playlist}
							></PlaylistCardProfile>
						))}
					</Section>
				);
			}
		} else {
			return null;
		}
	}
}

export function FollowersSection({ username }: { username: string }) {
	const { cardsCount } = useCardsCountStore();

	const userQuery = useUserQuery(username);
	const user = userQuery.data?.data;

	const followersQuery = useFollowersQuery(user?.id, 7);
	const followers = followersQuery.data?.data;

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
			return null;
		}
	}
}

export function FollowingSection({ username }: { username: string }) {
	const { cardsCount } = useCardsCountStore();

	const userQuery = useUserQuery(username);
	const user = userQuery.data?.data;

	const followingQuery = useFollowingQuery(user?.id, 7);
	const following = followingQuery.data?.data;

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
			return null;
		}
	}
}
