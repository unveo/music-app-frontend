import { Metadata } from 'next';
import UploadTrack from './UploadTrack';

export const metadata: Metadata = {
	title: 'Upload'
};

export default function UploadTrackPage() {
	return <UploadTrack></UploadTrack>;
}
