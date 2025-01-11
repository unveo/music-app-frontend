import MyTracks from './MyTracks';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'My tracks'
};

export default function MyTracksPage() {
	return <MyTracks></MyTracks>;
}
