import { Metadata } from 'next';
import Followers from './Followers';

export const metadata: Metadata = {
	title: { default: 'Username followers', template: '' },
	description: ''
};

export default function FollowersPage({
	params
}: {
	params: { username: string };
}) {
	return <Followers username={params.username}></Followers>;
}
