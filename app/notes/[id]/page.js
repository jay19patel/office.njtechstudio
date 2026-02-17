
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getNote } from '@/lib/data-service';
import { KEYS } from '@/hooks/useData';
import PageContent from './PageContent';

export default async function Page({ params }) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: KEYS.NOTE(id),
        queryFn: () => getNote(id)
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PageContent />
        </HydrationBoundary>
    );
}
