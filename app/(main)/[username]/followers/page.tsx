import { Metadata } from 'next';
import Followers from './Followers';

type Props = {
	params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { username } = await params;

	return {
		title: `${username} followers`
	};
}

export default async function FollowersPage({ params }: Props) {
	const { username } = await params;

	return <Followers username={username}></Followers>;
}
