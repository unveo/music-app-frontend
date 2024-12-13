import { Metadata } from 'next';
import Playlists from './Playlists';

export const metadata: Metadata = {
	title: { default: 'Username playlists', template: '' },
	description: ''
};

export default function PlaylistsPage({
	params
}: {
	params: { username: string };
}) {
	return <Playlists username={params.username}></Playlists>;
}
