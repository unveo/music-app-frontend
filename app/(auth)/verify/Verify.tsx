'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useVerifyQuery } from '@/hooks/queries';

export default function Verify() {
	const { push } = useRouter();
	const { toast } = useToast();

	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	const verifyQuery = useVerifyQuery(token);

	useEffect(() => {
		if (!token) {
			push('/login');
			return;
		}

		if (verifyQuery.isError) {
			const error = verifyQuery.error as any;

			toast({
				title: error.response.data.message,
				variant: 'destructive'
			});
			push('/login');
		}

		if (verifyQuery.data?.data) {
			toast({
				title: 'Verification successful'
			});
			push('/');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token, verifyQuery.isError, verifyQuery.data, verifyQuery.error]);

	return null;
}
