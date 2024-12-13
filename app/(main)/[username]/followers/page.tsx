import { Metadata } from 'next';
import Followers from './Followers';

export const metadata: Metadata = {
	title: { default: 'Username tracks', template: '' },
	description: ''
};

export default function TracksPage({
	params
}: {
	params: { username: string };
}) {
	return <Followers username={params.username}></Followers>;
}
