'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getErrorMessage } from '@/lib/error-message';

export default function Providers({ children }: React.PropsWithChildren) {
	const { toast } = useToast();
	const toastRef = useRef(toast);
	toastRef.current = toast;

	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: { retry: false },
					mutations: {
						retry: false,
						onError: (error: unknown) => {
							toastRef.current({
								title: getErrorMessage(error),
								description: 'Try again or refresh the page.',
								variant: 'destructive'
							});
						}
					}
				}
			})
	);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
