import { Metadata } from 'next';
import Tracks from './Tracks';

export const metadata: Metadata = {
	title: { default: 'Username tracks', template: '' },
	description: ''
};

export default function TracksPage({
	params
}: {
	params: { username: string };
}) {
	return <Tracks username={params.username}></Tracks>;
}
