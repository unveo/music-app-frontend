import LikedTracks from './LikedTracks';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: { default: 'Liked tracks', template: '' },
	description: ''
};

export default function LikedTracksPage() {
	return <LikedTracks></LikedTracks>;
}
