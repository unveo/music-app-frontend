import { Metadata } from 'next';
import Albums from './Albums';

type Props = {
	params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { username } = await params;
	return {
		title: `${username} albums`
	};
}

export default async function AlbumsPage({ params }: Props) {
	const { username } = await params;
	return <Albums username={username}></Albums>;
}
