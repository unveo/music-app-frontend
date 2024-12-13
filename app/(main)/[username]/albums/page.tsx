import { Metadata } from 'next';
import Albums from './Albums';

export const metadata: Metadata = {
	title: { default: 'Username tracks', template: '' },
	description: ''
};

export default function TracksPage({
	params
}: {
	params: { username: string };
}) {
	return <Albums username={params.username}></Albums>;
}
