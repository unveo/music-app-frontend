import { Metadata } from 'next';
import UploadTrack from './UploadTrack';

export const metadata: Metadata = {
	title: { default: 'Upload', template: '' },
	description: ''
};

export default function UploadTrackPage() {
	return <UploadTrack></UploadTrack>;
}
