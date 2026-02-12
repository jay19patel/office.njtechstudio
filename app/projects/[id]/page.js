
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getOfficeData } from '@/lib/data-service';
import PageContent from './PageContent';
import { cookies } from 'next/headers';

export default async function Page() {
    const queryClient = new QueryClient();
    const cookieStore = await cookies();
    const officePin = cookieStore.get('officePin')?.value;

    await queryClient.prefetchQuery({
        queryKey: ['projectData'],
        queryFn: () => getOfficeData(officePin)
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PageContent />
        </HydrationBoundary>
    );
}
