import { Suspense } from 'react';
import Search from './Search';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Search'
};

export default function SearchPage() {
	return (
		<Suspense>
			<Search></Search>
		</Suspense>
	);
}
