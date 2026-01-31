import connectToDatabase from '@/lib/db';
import Office from '@/models/Office';

function generatePin() {
    // Generate a 6-digit random pin
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
    try {
        await connectToDatabase();
        const { name, email } = await request.json();

        if (!name || !email) {
            return Response.json({ error: "Name and Email are required" }, { status: 400 });
        }

        // Generate a unique PIN
        let pin = generatePin();
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 10) {
            const existing = await Office.findOne({ pin });
            if (!existing) {
                isUnique = true;
            } else {
                pin = generatePin();
                attempts++;
            }
        }

        if (!isUnique) {
            return Response.json({ error: "Failed to generate a unique PIN. Please try again." }, { status: 500 });
        }

        const newOffice = await Office.create({
            pin,
            name,
            email
        });

        return Response.json({
            success: true,
            pin: newOffice.pin,
            message: "Office registered successfully. Please save your PIN."
        });

    } catch (error) {
        console.error("Registration error:", error);
        return Response.json({ error: "Registration failed" }, { status: 500 });
    }
}
