import { Metadata } from 'next';
import Following from './Following';

export const metadata: Metadata = {
	title: { default: 'Username following', template: '' },
	description: ''
};

export default function FollowingPage({
	params
}: {
	params: { username: string };
}) {
	return <Following username={params.username}></Following>;
}
