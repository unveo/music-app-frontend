export function PlayerFooterLayout({
	children
}: Readonly<{
	children?: React.ReactNode;
}>) {
	return (
		<footer className='sticky bottom-0 flex h-32 max-h-32 min-h-32 justify-center border-t bg-background sm:h-16 sm:max-h-16 sm:min-h-16'>
			<div className='flex h-full w-full max-w-[80rem] flex-col px-2 sm:flex-row sm:items-center'>
				{children}
			</div>
		</footer>
	);
}
