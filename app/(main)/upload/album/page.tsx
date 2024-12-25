import { Metadata } from 'next';
import UploadAlbum from './UploadAlbum';

export const metadata: Metadata = {
	title: 'Upload'
};

export default function UploadAlbumPage() {
	return <UploadAlbum></UploadAlbum>;
}
