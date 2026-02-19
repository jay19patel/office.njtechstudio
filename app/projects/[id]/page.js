
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getOfficeData, getProject } from '@/lib/data-service';
import PageContent from './PageContent';
import { cookies } from 'next/headers';

export default async function Page({ params }) {
    const queryClient = new QueryClient();
    const cookieStore = await cookies();
    const officePin = cookieStore.get('officePin')?.value;

    const { id } = await params;

    await queryClient.prefetchQuery({
        queryKey: ['projects', id],
        queryFn: () => getProject(id, officePin)
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PageContent />
        </HydrationBoundary>
    );
}
