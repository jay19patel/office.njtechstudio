
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getNotes } from '@/lib/data-service';
import { KEYS } from '@/hooks/useData';
import PageContent from './PageContent';
import { cookies } from 'next/headers';

export default async function Page() {
    const queryClient = new QueryClient();
    const cookieStore = await cookies();
    const officePin = cookieStore.get('officePin')?.value;

    // We only prefetch default (empty query) notes on server
    // Search queries will remain client-side or we could prefetch if searchParams were available (they are in Page props)
    await queryClient.prefetchQuery({
        queryKey: KEYS.NOTES(''),
        queryFn: () => getNotes(officePin, '')
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PageContent />
        </HydrationBoundary>
    );
}
