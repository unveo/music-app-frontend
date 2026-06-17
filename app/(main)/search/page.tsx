import type { Metadata } from 'next';
import { Suspense } from 'react';
import Search from './Search';

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
