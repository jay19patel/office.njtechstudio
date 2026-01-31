import connectToDatabase from '@/lib/db';
import Office from '@/models/Office';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        await connectToDatabase();
        const cookieStore = await cookies();
        const officePin = cookieStore.get('officePin')?.value;

        if (!officePin) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const office = await Office.findOne({ pin: officePin });

        if (!office) {
            return Response.json({ error: "Office not found" }, { status: 404 });
        }

        // Return flat structure for frontend compatibility or nested, let's keep it consistent
        return Response.json({
            officeName: office.name,
            email: office.email,
            officeTime: office.settings?.officeTime || '9:00 AM - 6:00 PM',
            isOnline: office.settings?.isOnline ?? true
        });
    } catch (error) {
        console.error("Error fetching settings:", error);
        return Response.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectToDatabase();
        const cookieStore = await cookies();
        const officePin = cookieStore.get('officePin')?.value;

        if (!officePin) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        const updatedOffice = await Office.findOneAndUpdate(
            { pin: officePin },
            {
                $set: {
                    name: data.officeName,
                    email: data.email,
                    'settings.officeTime': data.officeTime,
                    'settings.isOnline': data.isOnline
                }
            },
            { new: true }
        );

        if (!updatedOffice) {
            return Response.json({ error: "Office not found" }, { status: 404 });
        }

        return Response.json({
            officeName: updatedOffice.name,
            email: updatedOffice.email,
            officeTime: updatedOffice.settings.officeTime,
            isOnline: updatedOffice.settings.isOnline
        });
    } catch (error) {
        console.error("Error saving settings:", error);
        return Response.json({ error: "Failed to save settings" }, { status: 500 });
    }
}
