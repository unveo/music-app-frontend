import { Metadata } from 'next';
import ProfileSettings from './ProfileSettings';

export const metadata: Metadata = {
	title: 'Profile settings'
};

export default function ProfileSettingsPage() {
	return <ProfileSettings></ProfileSettings>;
}
