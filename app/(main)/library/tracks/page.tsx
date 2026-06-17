import type { Metadata } from 'next';
import LikedTracks from './LikedTracks';

export const metadata: Metadata = {
	title: 'Liked tracks'
};

export default function LikedTracksPage() {
	return <LikedTracks></LikedTracks>;
}
