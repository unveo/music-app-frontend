import { Metadata } from 'next';
import Tracks from './Tracks';

type Props = {
	params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { username } = await params;

	return {
		title: `${username} tracks`
	};
}

export default async function TracksPage({ params }: Props) {
	const { username } = await params;

	return <Tracks username={username}></Tracks>;
}
