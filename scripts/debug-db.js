const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/office_db";

const ProjectSchema = new mongoose.Schema({
    id: String,
    officeId: String,
    title: String,
    status: String
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const projects = await Project.find({});
        console.log(`Total Projects: ${projects.length}`);

        projects.forEach(p => {
            console.log(`- Title: "${p.title}", Status: "${p.status}", OfficeID: "${p.officeId}", ID: "${p._id}"`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
