import Home from './Home';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Music app' },
  description: ''
};

export default function HomePage() {
  return <Home></Home>;
}
