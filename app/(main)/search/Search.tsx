'use client';

import { useQuery } from '@tanstack/react-query';
import { SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlbumRow, TrackRow, UserRow } from '@/components/SearchRows';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { searchService } from '@/services/search/search.service';

export function useSearchQuery(query: string) {
	return useQuery({
		queryKey: ['search', query],
		queryFn: () => searchService.search(query),
		enabled: !!query,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		staleTime: 1000 * 60 * 5
	});
}

export default function Search() {
	const router = useRouter();

	const searchParams = useSearchParams();
	const search = searchParams.get('search') || '';

	const [query, setQuery] = useState(search);

	const searchQuery = useSearchQuery(search);
	const searchData = searchQuery.data?.data;

	useEffect(() => {
		setQuery(search);
	}, [search]);

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		router.push(`?search=${encodeURIComponent(query.trim())}`);
	}

	return (
		<div className='flex flex-col items-center gap-4 p-4 sm:p-6 md:p-8'>
			<form
				onSubmit={handleSubmit}
				className='flex w-full max-w-md flex-col items-center gap-2 sm:flex-row'
			>
				<div className='flex w-full items-center gap-2'>
					<Label htmlFor='search' className='sr-only'>
						Search
					</Label>
					<Input
						id='search'
						name='search'
						type='search'
						autoComplete='off'
						spellCheck={false}
						placeholder='Search…'
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						maxLength={30}
						className='h-10 flex-grow rounded-md border border-input bg-background px-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
					/>
					<Button
						type='submit'
						variant='outline'
						className='size-10 min-h-10 min-w-10 rounded-md p-0'
						aria-label='Search'
					>
						<SearchIcon className='size-5' aria-hidden='true' />
					</Button>
				</div>
				{searchQuery.isLoading ? (
					<div role='status' aria-live='polite'>
						<LoadingSpinner className='opacity-100' aria-hidden='true' />
						<span className='sr-only'>Searching…</span>
					</div>
				) : null}
			</form>
			{search && searchQuery.isError ? (
				<p className='text-center text-muted-foreground' role='alert'>
					Search failed. Try again or refresh the page.
				</p>
			) : null}
			{searchData && (
				<div className='w-full max-w-7xl'>
					{searchData.length > 0 ? (
						<ul className='grid grid-cols-3 grid-rows-1 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
							{searchData.map((result) => {
								if (result.type === 'user') {
									return (
										<UserRow
											key={`user_${result.document.id}`}
											user={result.document}
										/>
									);
								} else if (result.type === 'album') {
									return (
										<AlbumRow
											key={`album_${result.document.id}`}
											album={result.document}
										/>
									);
								} else {
									return (
										<TrackRow
											key={`track_${result.document.id}`}
											track={result.document}
										/>
									);
								}
							})}
						</ul>
					) : (
						<p className='text-center text-muted-foreground'>
							No results found. Try a different search term.
						</p>
					)}
				</div>
			)}
		</div>
	);
}
