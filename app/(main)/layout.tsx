import Header from '@/components/Header';
import Player from '@/components/Player';

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
			<Player></Player>
		</>
	);
}
