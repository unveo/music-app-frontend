import { Metadata } from 'next';
import Following from './Following';

export const metadata: Metadata = {
	title: { default: 'Username tracks', template: '' },
	description: ''
};

export default function TracksPage({
	params
}: {
	params: { username: string };
}) {
	return <Following username={params.username}></Following>;
}
