import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'data.json');

export async function GET() {
    try {
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const data = JSON.parse(fileContents);
        return Response.json(data);
    } catch (error) {
        console.error("Error reading data:", error);
        return Response.json({ error: "Failed to load data" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const newData = await request.json();
        await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), 'utf8');
        return Response.json({ success: true, data: newData });
    } catch (error) {
        console.error("Error writing data:", error);
        return Response.json({ error: "Failed to save data" }, { status: 500 });
    }
}
