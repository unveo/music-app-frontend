import { Metadata } from 'next';
import Playlists from './Playlists';

type Props = {
	params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { username } = await params;

	return {
		title: `${username} playlists`
	};
}

export default async function PlaylistsPage({ params }: Props) {
	const { username } = await params;

	return <Playlists username={username}></Playlists>;
}
