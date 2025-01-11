import { Metadata } from 'next';
import Following from './Following';

type Props = {
	params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { username } = await params;

	return {
		title: `${username} following`
	};
}

export default async function FollowingPage({ params }: Props) {
	const { username } = await params;

	return <Following username={username}></Following>;
}
