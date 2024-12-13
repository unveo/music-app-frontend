import { Metadata } from 'next';
import Profile from './Profile';

export const metadata: Metadata = {
	title: { default: 'Username', template: '' },
	description: ''
};

export default async function ProfilePage({
	params
}: {
	params: { username: string };
}) {
	const { username } = await params;
	return <Profile username={username}></Profile>;
}
