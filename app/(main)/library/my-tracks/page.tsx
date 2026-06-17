import type { Metadata } from 'next';
import MyTracks from './MyTracks';

export const metadata: Metadata = {
	title: 'My tracks'
};

export default function MyTracksPage() {
	return <MyTracks></MyTracks>;
}
