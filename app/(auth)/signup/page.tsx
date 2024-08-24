import Signup from './Signup';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Sign up', template: '' },
  description: ''
};

export default function SignupPage() {
  return <Signup></Signup>;
}
