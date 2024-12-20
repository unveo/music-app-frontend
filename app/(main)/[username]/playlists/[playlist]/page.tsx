import { Metadata } from 'next';
import Playlist from './Playlist';

export const metadata: Metadata = {
	title: { default: 'Playlist name', template: '' },
	description: ''
};

export default async function PlaylistPage({
	params
}: {
	params: { username: string; playlist: string };
}) {
	return (
		<Playlist username={params.username} playlist={params.playlist}></Playlist>
	);
}
