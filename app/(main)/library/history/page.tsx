import History from './History';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'History'
};

export default function HistoryPage() {
	return <History></History>;
}
