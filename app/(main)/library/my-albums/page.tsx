import type { Metadata } from 'next';
import MyAlbums from './MyAlbums';

export const metadata: Metadata = {
	title: 'My albums'
};

export default function MyAlbumsPage() {
	return <MyAlbums></MyAlbums>;
}
