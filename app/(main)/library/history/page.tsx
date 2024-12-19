import History from './History';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: { default: 'History', template: '' },
	description: ''
};

export default function HistoryPage() {
	return <History></History>;
}
