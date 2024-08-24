import Upload from './Upload';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Upload', template: '' },
  description: ''
};

export default function UploadPage() {
  return <Upload></Upload>;
}
