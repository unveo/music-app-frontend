import { Metadata } from 'next';
import Track from './Track';

type Props = {
	params: Promise<{ username: string; track: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { track } = await params;

	return {
		title: `${track} track`
	};
}

export default async function TrackPage({ params }: Props) {
	const { username, track } = await params;

	return <Track username={username} changeableId={track}></Track>;
}
