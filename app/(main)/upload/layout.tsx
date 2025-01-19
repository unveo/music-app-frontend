export default function UploadLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10'>
			<div className='mx-auto grid w-full max-w-6xl gap-2'>
				<h1 className='text-2xl font-semibold'>Upload</h1>
			</div>
			<div className='mx-auto flex w-full max-w-6xl flex-col items-start gap-4 md:flex-row md:gap-32'>
				{children}
			</div>
		</div>
	);
}
