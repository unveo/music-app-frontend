import { Metadata } from 'next';
import Albums from './Albums';

export const metadata: Metadata = {
	title: { default: 'Username albums', template: '' },
	description: ''
};

export default function AlbumsPage({
	params
}: {
	params: { username: string };
}) {
	return <Albums username={params.username}></Albums>;
}
