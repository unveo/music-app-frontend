import { AlbumsList, TracksList } from '@/components/Lists';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: { default: 'Username tracks', template: '' },
	description: ''
};

export default function TracksPage({
	params
}: {
	params: { username: string };
}) {
	return <AlbumsList username={params.username}></AlbumsList>;
}
