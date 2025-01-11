import MyAlbums from './MyAlbums';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'My albums'
};

export default function MyAlbumsPage() {
	return <MyAlbums></MyAlbums>;
}
