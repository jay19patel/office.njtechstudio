import { NextResponse } from 'next/server';
import { getOfficeData } from '@/lib/data-service';
import { cookies } from 'next/headers';

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const officePin = cookieStore.get('officePin')?.value;

        if (!officePin) {
            return NextResponse.json({ projects: [] });
        }

        const data = await getOfficeData(officePin);

        return NextResponse.json({ projects: data.projects });

    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
