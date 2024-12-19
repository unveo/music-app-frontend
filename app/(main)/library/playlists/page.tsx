import SavedPlaylists from './SavedPlaylists';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: { default: 'Saved playlists', template: '' },
	description: ''
};

export default function SavedPlaylistsPage() {
	return <SavedPlaylists></SavedPlaylists>;
}
