import type { Metadata } from 'next';
import SavedPlaylists from './SavedPlaylists';

export const metadata: Metadata = {
	title: 'Saved playlists'
};

export default function SavedPlaylistsPage() {
	return <SavedPlaylists></SavedPlaylists>;
}
