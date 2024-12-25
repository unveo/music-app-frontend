import { Metadata } from 'next';
import Profile from './Profile';

type Props = {
	params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { username } = await params;
	return {
		title: `${username}`
	};
}

export default async function ProfilePage({ params }: Props) {
	const { username } = await params;
	return <Profile username={username}></Profile>;
}
