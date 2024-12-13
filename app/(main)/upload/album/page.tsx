import { Metadata } from 'next';
import UploadAlbum from './UploadAlbum';

export const metadata: Metadata = {
	title: { default: 'Upload', template: '' },
	description: ''
};

export default function UploadAlbumPage() {
	return <UploadAlbum></UploadAlbum>;
}
