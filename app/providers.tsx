'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

export default function Providers({ children }: React.PropsWithChildren) {
	const { toast } = useToast();

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
