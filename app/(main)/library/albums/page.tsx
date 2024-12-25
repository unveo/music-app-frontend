import LikedAlbums from './LikedAlbums';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Liked albums'
};

export default function LikedAlbumsPage() {
	return <LikedAlbums></LikedAlbums>;
}
