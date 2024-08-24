import Login from './Login';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Login', template: '' },
  description: ''
};

export default function LoginPage() {
  return <Login></Login>;
}
