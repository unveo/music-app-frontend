import { Metadata } from 'next';
import SecuritySettings from './SecuritySettings';

export const metadata: Metadata = {
	title: 'Security settings'
};

export default function SecuritySettingsPage() {
	return <SecuritySettings></SecuritySettings>;
}
