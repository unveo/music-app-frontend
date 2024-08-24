export default function AuthLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main>
			<div className='div-main items-center justify-center'>{children}</div>
		</main>
	);
}
