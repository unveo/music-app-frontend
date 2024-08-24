import { PlaylistsList } from '@/components/Lists';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: { default: 'Username playlists', template: '' },
	description: ''
};

export default function PlaylistsPage({
	params
}: {
	params: { username: string };
}) {
	return <PlaylistsList username={params.username}></PlaylistsList>;
}
