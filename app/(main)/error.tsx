'use client';

import { Button } from '@/components/ui/button';

export default function MainError({
	error,
	reset
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className='flex flex-grow flex-col items-center justify-center gap-4 py-24'>
			<h2 className='text-lg font-semibold'>Something went wrong</h2>
			<p className='max-w-md text-center text-muted-foreground'>
				{error.message || 'Try refreshing the page or go back and try again.'}
			</p>
			<Button type='button' onClick={reset}>
				Try again
			</Button>
		</div>
	);
}
