import SavedPlaylists from './SavedPlaylists';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Saved playlists'
};

export default function SavedPlaylistsPage() {
	return <SavedPlaylists></SavedPlaylists>;
}
