import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MainLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header></Header>
			<main>
				<div className='div-main'>{children}</div>
			</main>
			<Footer></Footer>
			<Toaster />
		</>
	);
}
