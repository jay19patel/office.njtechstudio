import connectToDatabase from '@/lib/db';
import Office from '@/models/Office';

export async function POST(request) {
    try {
        await connectToDatabase();
        const { pin } = await request.json();

        if (!pin) {
            return Response.json({ error: "PIN is required" }, { status: 400 });
        }

        const office = await Office.findOne({ pin });

        if (!office) {
            return Response.json({ error: "Invalid Office PIN" }, { status: 401 });
        }

        return Response.json({ success: true, office: { name: office.name, email: office.email } });

    } catch (error) {
        console.error("Login error:", error);
        return Response.json({ error: "Login failed" }, { status: 500 });
    }
}
