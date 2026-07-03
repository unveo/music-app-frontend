import LibraryNav from '@/components/LibraryNav';

export default function LibraryLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className='library-div'>
			<LibraryNav />
			{children}
		</div>
	);
}
