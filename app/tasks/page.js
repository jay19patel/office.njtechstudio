
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getOfficeData } from '@/lib/data-service';
import { KEYS } from '@/hooks/useData';
import PageContent from './PageContent';
import { cookies } from 'next/headers';

export default async function Page() {
    const queryClient = new QueryClient();
    const cookieStore = await cookies();
    const officePin = cookieStore.get('officePin')?.value;

    await queryClient.prefetchQuery({
        queryKey: KEYS.ALL_TASKS,
        queryFn: async () => {
            const data = await getOfficeData(officePin);
            return { projects: data.projects };
        },
        staleTime: 60 * 1000,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PageContent />
        </HydrationBoundary>
    );
}
