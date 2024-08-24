'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user/user.service';

export default function MainLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	useQuery({
		queryKey: ['current-user'],
		queryFn: () => userService.getCurrent()
	});

	return (
		<>
			<Header></Header>
			<main>
				<div className='div-main'>{children}</div>
			</main>
			<Footer></Footer>
		</>
	);
}
