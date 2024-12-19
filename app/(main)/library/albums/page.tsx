import LikedAlbums from './LikedAlbums';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: { default: 'Liked albums', template: '' },
	description: ''
};

export default function LikedAlbumsPage() {
	return <LikedAlbums></LikedAlbums>;
}
