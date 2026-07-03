import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Loading() {
	return (
		<div
			className='flex flex-grow items-center justify-center py-24'
			role='status'
			aria-live='polite'
		>
			<LoadingSpinner className='opacity-100' aria-hidden='true' />
			<span className='sr-only'>Loading…</span>
		</div>
	);
}
