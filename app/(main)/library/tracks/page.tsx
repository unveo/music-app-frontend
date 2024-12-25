import LikedTracks from './LikedTracks';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Liked tracks'
};

export default function LikedTracksPage() {
	return <LikedTracks></LikedTracks>;
}
