import { Metadata } from 'next';
import Album from './Album';

type Props = {
	params: Promise<{ username: string; album: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { album } = await params;
	return {
		title: `${album} album`
	};
}

export default async function AlbumPage({ params }: Props) {
	const { username, album } = await params;
	return <Album username={username} album={album}></Album>;
}
