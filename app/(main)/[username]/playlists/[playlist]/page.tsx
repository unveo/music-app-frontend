import { Metadata } from 'next';
import Playlist from './Playlist';

type Props = {
	params: Promise<{ username: string; playlist: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { playlist } = await params;
	return {
		title: `${playlist} playlist`
	};
}

export default async function PlaylistPage({ params }: Props) {
	const { username, playlist } = await params;
	return <Playlist username={username} playlist={playlist}></Playlist>;
}
