'use client';

import { useMutation } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { listeningHistoryService } from '@/services/user/listening-history/listening-history.service';
import { useDisabledHistoryQuery } from './queries';

export function useAddToHistoryMut() {
	const listeningHistoryQuery = useDisabledHistoryQuery();

	const pathname = usePathname();

	return useMutation({
		mutationFn: (trackId: number) => listeningHistoryService.add(trackId),
		onSuccess: () => {
			if (pathname === '/library/history') {
				listeningHistoryQuery.refetch();
			}
		}
	});
}
