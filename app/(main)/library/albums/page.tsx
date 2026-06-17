import type { Metadata } from 'next';
import LikedAlbums from './LikedAlbums';

export const metadata: Metadata = {
	title: 'Liked albums'
};

export default function LikedAlbumsPage() {
	return <LikedAlbums></LikedAlbums>;
}
