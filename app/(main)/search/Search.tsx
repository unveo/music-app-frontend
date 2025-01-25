'use client';

import { AlbumRow, TrackRow, UserRow } from '@/components/SearchRows';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { searchService } from '@/services/search/search.service';
import { useQuery } from '@tanstack/react-query';
import { SearchIcon } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

	const [query, setQuery] = useState('');

	const searchQuery = useSearchQuery(search);
	const searchData = searchQuery.data?.data;

	useEffect(() => {
		if (search) {
			setQuery(search);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='flex flex-col items-center gap-4 p-4 sm:p-6 md:p-8'>
			<div className='flex w-full max-w-md flex-col items-center gap-2 sm:flex-row'>
				<div className='flex w-full items-center gap-2'>
					<div className='flex h-10 flex-grow items-center rounded-md border border-border bg-background px-2'>
						<Input
							id='search'
							placeholder='Search...'
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							maxLength={30}
							className='w-full'
						/>
					</div>
					<Button
						variant='outline'
						className='size-10 min-h-10 min-w-10 rounded-md p-0'
						onClick={() => router.push(`?search=${query}`)}
					>
						<SearchIcon className='size-5' />
					</Button>
				</div>
				{searchQuery.isLoading ? (
					<LoadingSpinner className='opacity-100' />
				) : null}
			</div>
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
							No results found
						</p>
					)}
				</div>
			)}
		</div>
	);
}
