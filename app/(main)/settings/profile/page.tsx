import { Metadata } from 'next';
import ProfileSettings from './ProfileSettings';

export const metadata: Metadata = {
	title: { default: 'Profile settings', template: '' },
	description: ''
};

export default function ProfileSettingsPage() {
	return <ProfileSettings></ProfileSettings>;
}
