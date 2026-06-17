import type { Metadata } from 'next';
import Following from './Following';

export const metadata: Metadata = {
	title: 'Following'
};

export default function FollowingPage() {
	return <Following></Following>;
}
