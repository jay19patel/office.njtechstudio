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

        // Update last login
        office.lastLogin = new Date();
        await office.save();

        // Create response
        const response = Response.json({
            success: true,
            office: {
                name: office.name,
                email: office.email,
                lastLogin: office.lastLogin
            }
        });

        // Set cookie
        // Note: We use 'officePin' as the auth token as per current app logic
        // In a real app, this should be a secure session token
        response.headers.set('Set-Cookie', `officePin=${pin}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`);

        return response;

    } catch (error) {
        console.error("Login error:", error);
        return Response.json({ error: "Login failed" }, { status: 500 });
    }
}
