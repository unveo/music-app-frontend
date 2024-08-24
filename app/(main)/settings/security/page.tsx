import { Metadata } from 'next';
import SecuritySettings from './SecuritySettings';

export const metadata: Metadata = {
	title: { default: 'Security settings', template: '' },
	description: ''
};

export default function SecuritySettingsPage() {
	return <SecuritySettings></SecuritySettings>;
}
