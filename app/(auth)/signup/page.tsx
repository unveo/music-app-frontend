import Signup from './Signup';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Sign up'
};

export default function SignupPage() {
	return <Signup></Signup>;
}
