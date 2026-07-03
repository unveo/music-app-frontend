'use client';

import { LoadingSpinner } from '@/components/ui/loading-spinner';

type LibraryGridShellProps = {
	isLoading: boolean;
	isError: boolean;
	isEmpty: boolean;
	emptyMessage: string;
	errorMessage?: string;
	children: React.ReactNode;
};

export function LibraryGridShell({
	isLoading,
	isError,
	isEmpty,
	emptyMessage,
	errorMessage = 'Something went wrong. Refresh the page and try again.',
	children
}: LibraryGridShellProps) {
	if (isLoading) {
		return (
			<div
				className='flex justify-center py-12'
				role='status'
				aria-live='polite'
			>
				<LoadingSpinner className='opacity-100' aria-hidden='true' />
				<span className='sr-only'>Loading…</span>
			</div>
		);
	}

	if (isError) {
		return (
			<p className='text-center text-muted-foreground' role='alert'>
				{errorMessage}
			</p>
		);
	}

	if (isEmpty) {
		return <p className='text-center text-muted-foreground'>{emptyMessage}</p>;
	}

	return children;
}
