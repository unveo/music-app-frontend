'use client';

import { AlbumRow, TrackRow, UserRow } from '@/components/SearchRows';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useCurrentUserQuery } from '@/hooks/queries';
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

	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	const searchQuery = useSearchQuery(search);
	const searchData = searchQuery.data?.data;

	useEffect(() => {
		if (search) {
			setQuery(search);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='flex flex-col items-center gap-4 p-8'>
			<div className='flex items-center gap-2'>
				<div className='flex h-10 w-80 items-center rounded-md border border-border bg-background px-2'>
					<Input
						id='search'
						placeholder='Search...'
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						disabled={!currentUser}
						maxLength={30}
						className=''
					/>
				</div>
				<Button
					variant='outline'
					className='size-10 min-h-10 min-w-10 rounded-md p-0'
					onClick={() => router.push(`?search=${query}`)}
				>
					<SearchIcon className='size-5' />
				</Button>
				<LoadingSpinner
					className={searchQuery.isLoading ? 'opacity-100' : 'opacity-0'}
				/>
			</div>
			{searchData &&
				(searchData.length > 0 ? (
					<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
						{searchData.map((result) => {
							if (result.type === 'user') {
								return (
									<UserRow
										key={`user_${result.document.id}`}
										user={result.document}
									></UserRow>
								);
							} else if (result.type === 'album') {
								return (
									<AlbumRow
										key={`album_${result.document.id}`}
										album={result.document}
									></AlbumRow>
								);
							} else {
								return (
									<TrackRow
										key={`track_${result.document.id}`}
										track={result.document}
									></TrackRow>
								);
							}
						})}
					</ul>
				) : (
					<></>
				))}
		</div>
	);
}
