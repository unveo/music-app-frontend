import Link from 'next/link';

export default function NotFound() {
	return (
		<div className='flex flex-grow flex-col items-center justify-center gap-5'>
			<p className='text-5xl'> {'Not found :('}</p>
			<Link
				href='/'
				className='h-10 rounded-md border bg-background px-4 py-2 shadow-sm hover:bg-accent hover:text-accent-foreground'
			>
				Go to home
			</Link>
		</div>
	);
}
