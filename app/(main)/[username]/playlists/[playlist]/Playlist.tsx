'use client';

import { playlistTrackService } from '@/services/playlist/playlist-track/playlist-track.service';
import { playlistService } from '@/services/playlist/playlist.service';
import { useQuery } from '@tanstack/react-query';

export default function Playlist({
	username,
	playlist
}: {
	username: string;
	playlist: string;
}) {
	const playlistQuery = useQuery({
		queryKey: ['playlist', playlistId],
		queryFn: () => playlistService.getOneFull(playlistId)
	});
	const playlist = playlistQuery.data?.data;
	const playlistTracksQuery = useQuery({
		queryKey: ['playlist-tracks', playlistId],
		queryFn: () => playlistTrackService.getMany(playlistId)
	});
	const playlistTracks = playlistTracksQuery.data?.data;

	if (!playlist || !playlistTracks) {
		return <>loading</>;
	}
}
