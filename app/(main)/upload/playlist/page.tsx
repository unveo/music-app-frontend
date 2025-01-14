import { Metadata } from 'next';
import CreatePlaylist from './CreatePlaylist';

export const metadata: Metadata = {
	title: 'Create playlist'
};

export default function CreatePlaylistPage() {
	return <CreatePlaylist></CreatePlaylist>;
}
