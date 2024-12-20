import { Metadata } from 'next';
import Profile from './Profile';

export const metadata: Metadata = {
	title: { default: 'Username', template: '' },
	description: ''
}; // username TODO

export default async function ProfilePage({
	params
}: {
	params: { username: string };
}) {
	return <Profile username={params.username}></Profile>;
}
