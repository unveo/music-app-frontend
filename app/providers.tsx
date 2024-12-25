'use client';

import { toast } from '@/components/ui/use-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Providers({ children }: React.PropsWithChildren) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: {
				retry: false,
				onError: (error: any) => {
					toast({
						title: `${error.response.data.message}`,
						variant: 'destructive'
					});
				}
			}
		}
	});

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
