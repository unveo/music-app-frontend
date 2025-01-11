'use client';

import { albumTrackService } from '@/services/album/album-track/album-track.service';
import { albumService } from '@/services/album/album.service';
import { notificationService } from '@/services/notification/notification.service';
import { playlistTrackService } from '@/services/playlist/playlist-track/playlist-track.service';
import { playlistService } from '@/services/playlist/playlist.service';
import { trackService } from '@/services/track/track.service';
import { followService } from '@/services/user/follow/follow.service';
import { likedAlbumService } from '@/services/user/liked-album/liked-album.service';
import { likedTrackService } from '@/services/user/liked-track/liked-track.service';
import { listeningHistoryService } from '@/services/user/listening-history/listening-history.service';
import { savedPlaylistService } from '@/services/user/saved-playlist/saved-playlist.service';
import { userService } from '@/services/user/user.service';
import { useQuery } from '@tanstack/react-query';

export function useCurrentUserQuery() {
	return useQuery({
		queryKey: ['current-user'],
		queryFn: () => userService.getCurrent()
	});
}

export function useUserQuery(username: string) {
	return useQuery({
		queryKey: ['user', username],
		queryFn: () => userService.getByName(username)
	});
}

export function useUsersQuery(take?: number, lastId?: number) {
	return useQuery({
		queryKey: ['users'],
		queryFn: () => userService.getMany(take)
	});
}

export function useIsFollowedQuery(isCurrentUser: boolean, userId?: number) {
	return useQuery({
		queryKey: ['is-followed', userId],
		queryFn: () => followService.check(userId!),
		enabled: !!userId && !isCurrentUser
	});
}

export function useFollowersQuery(userId?: number, take?: number) {
	return useQuery({
		queryKey: ['followers', userId],
		queryFn: () => followService.getManyFollowers(userId!, take),
		enabled: !!userId
	});
}

export function useFollowingQuery(userId?: number, take?: number) {
	return useQuery({
		queryKey: ['following', userId],
		queryFn: () => followService.getManyFollowing(userId!, take),
		enabled: !!userId
	});
}

export function useTrackQuery(username: string, changeableId: string) {
	return useQuery({
		queryKey: ['track', changeableId],
		queryFn: () => trackService.getOne(username, changeableId)
	});
}

export function useTracksQuery(
	userId?: number,
	take?: number,
	lastId?: number
) {
	return useQuery({
		queryKey: ['tracks', userId],
		queryFn: () => trackService.getMany(userId!, take, lastId),
		enabled: !!userId
	});
}

export function useFirstTrackQuery(userId: number) {
	return useQuery({
		queryKey: ['fisrt-user-track', userId],
		queryFn: () => trackService.getMany(userId, 1)
	});
}

export function useAlbumQuery(username: string, changeableId: string) {
	return useQuery({
		queryKey: ['album', changeableId],
		queryFn: () => albumService.getOneFull(username, changeableId)
	});
}

export function useAlbumsQuery(
	userId?: number,
	take?: number,
	lastId?: number
) {
	return useQuery({
		queryKey: ['albums', userId],
		queryFn: () => albumService.getMany(userId!, take, lastId),
		enabled: !!userId
	});
}

export function useAlbumTracksQuery(
	changeableId: string,
	albumId?: number,
	take?: number
) {
	return useQuery({
		queryKey: ['album-tracks', changeableId],
		queryFn: () => albumTrackService.getManyTracks(albumId!, take),
		enabled: !!albumId
	});
}

export function useFirstAlbumTrackQuery(albumId: number) {
	return useQuery({
		queryKey: ['fisrt-album-track', albumId],
		queryFn: () => albumTrackService.getManyTracks(albumId, 1)
	});
}

export function usePlaylistQuery(username: string, changeableId: string) {
	return useQuery({
		queryKey: ['playlist', changeableId],
		queryFn: () => playlistService.getOneFull(username, changeableId)
	});
}

export function usePlaylistsQuery(userId?: number, take?: number) {
	return useQuery({
		queryKey: ['playlists', userId],
		queryFn: () => playlistService.getMany(userId!, take),
		enabled: !!userId
	});
}

export function usePlaylistsWithSavedQuery() {
	return useQuery({
		queryKey: ['playlists-with-saved'],
		queryFn: () => playlistService.getManyWithSaved()
	});
}

export function usePlaylistTracksQuery(
	changeableId: string,
	playlistId?: number,
	take?: number
) {
	return useQuery({
		queryKey: ['playlist-tracks', changeableId],
		queryFn: () => playlistTrackService.getMany(playlistId!, take),
		enabled: !!playlistId
	});
}

export function useFirstPlaylistTrackQuery(playlistId: number) {
	return useQuery({
		queryKey: ['fisrt-playlist-track', playlistId],
		queryFn: () => playlistTrackService.getMany(playlistId, 1)
	});
}

export function useLikedTracksQuery() {
	return useQuery({
		queryKey: ['liked-tracks'],
		queryFn: () => likedTrackService.getMany()
	});
}

export function useDisabledLikedTracksQuery() {
	return useQuery({
		queryKey: ['liked-tracks'],
		queryFn: () => likedTrackService.getMany(),
		enabled: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false
	});
}

export function useLikedAlbumsQuery() {
	return useQuery({
		queryKey: ['liked-albums'],
		queryFn: () => likedAlbumService.getMany()
	});
}

export function useHistoryQuery() {
	return useQuery({
		queryKey: ['listening-history'],
		queryFn: () => listeningHistoryService.get()
	});
}

export function useDisabledHistoryQuery() {
	return useQuery({
		queryKey: ['listening-history'],
		queryFn: () => listeningHistoryService.get(),
		enabled: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false
	});
}

export function useCurrentTrackQuery(trackId: number) {
	return useQuery({
		queryKey: ['current-track'],
		queryFn: () => trackService.getOneById(trackId),
		enabled: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false
	});
}

export function useNotificationsQuery() {
	return useQuery({
		queryKey: ['notifications'],
		queryFn: () => notificationService.getAll()
	});
}
