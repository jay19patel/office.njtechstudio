
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getOfficeSettings } from '@/lib/data-service';
import PageContent from './PageContent';
import { cookies } from 'next/headers';

export default async function Page() {
    const queryClient = new QueryClient();
    const cookieStore = await cookies();
    const officePin = cookieStore.get('officePin')?.value;

    // Prefetch settings only if user has a pin
    if (officePin) {
        await queryClient.prefetchQuery({
            queryKey: ['settings'],
            queryFn: () => getOfficeSettings(officePin)
        });
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PageContent />
        </HydrationBoundary>
    );
}
