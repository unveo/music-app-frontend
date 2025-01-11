import Following from './Following';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Following'
};

export default function FollowingPage() {
	return <Following></Following>;
}
