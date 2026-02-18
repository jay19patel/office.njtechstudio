
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Try to load .env.local or .env
try {
    const envLocalPath = path.resolve(process.cwd(), '.env.local');
    const envPath = path.resolve(process.cwd(), '.env');

    if (fs.existsSync(envLocalPath)) {
        require('dotenv').config({ path: envLocalPath });
    } else if (fs.existsSync(envPath)) {
        require('dotenv').config({ path: envPath });
    } else {
        console.warn('Warning: No .env or .env.local file found. Ensure MONGODB_URI is set.');
    }
} catch (e) {
    console.warn('Error loading env files:', e);
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI environment variable not defined.');
    process.exit(1);
}

// Schemas (Inlined to avoid module resolution issues in standalone script)
const SubtaskSchema = new mongoose.Schema();
SubtaskSchema.add({
    id: { type: String, required: true },
    title: String,
    type: String, // 'Task', 'Story', 'Bug', 'Epic'
    status: String,
    startDate: String,
    endDate: String,
    assigneeId: { type: String, default: null },
    sprintId: { type: String, default: null },
    description: { type: String, default: "" },
    estimatedHours: { type: String, default: "" },
    subtasks: [SubtaskSchema]
});

const ProjectSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    officeId: { type: String, required: true, index: true },
    title: String,
    description: String,
    status: String,
    startDate: String,
    endDate: String
});

const TaskSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    officeId: { type: String, required: true, index: true },
    title: String,
    type: String, // 'Task', 'Story', 'Bug', 'Epic'
    status: String,
    startDate: String,
    endDate: String,
    assigneeId: { type: String, default: null },
    description: { type: String, default: "" },
    projectId: { type: String, required: true, index: true },
    parentId: { type: String, default: null, index: true },
    order: { type: Number, default: 0 }
});

const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' },
    tags: [String],
    officeId: { type: String, required: true, index: true },
}, { timestamps: true });

const OfficeSchema = new mongoose.Schema({
    pin: { type: String, required: true, unique: true },
    name: { type: String, default: 'My Office' },
    email: { type: String, default: '' },
    settings: {
        officeTime: { type: String, default: '9:00 AM - 6:00 PM' },
        isOnline: { type: Boolean, default: true },
    },
    lastLogin: { type: Date }
}, { timestamps: true });

// Models
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);
const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema);
const Office = mongoose.models.Office || mongoose.model('Office', OfficeSchema);

async function seed() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    // 1. Get or Create Office
    let office = await Office.findOne({});
    if (!office) {
        console.log('No office found, creating default one...');
        office = await Office.create({
            pin: '123456',
            name: 'Creative Studio',
            email: 'admin@creativestudio.com',
            settings: { officeTime: '10:00 AM - 7:00 PM', isOnline: true }
        });
        console.log(`Created Office: ${office.name} (PIN: ${office.pin})`);
    } else {
        console.log(`Using existing Office: ${office.name} (PIN: ${office.pin})`);
    }
    const officeId = office.pin;

    // 2. Clear Existing Data
    console.log('Clearing existing Projects, Tasks, and Notes...');
    await Project.deleteMany({ officeId });
    await Task.deleteMany({ officeId });
    await Note.deleteMany({ officeId });
    console.log('Data cleared.');

    // 3. Seed Projects
    console.log('Seeding Projects...');

    const projectsData = [
        {
            id: 'p1',
            title: 'E-Commerce Platform Revamp',
            description: 'Modernizing the legacy e-commerce platform with Next.js and Microservices.',
            status: 'In Progress',
            startDate: '2024-01-15',
            endDate: '2024-06-30'
        },
        {
            id: 'p2',
            title: 'Mobile App Launch',
            description: 'iOS and Android app development using React Native.',
            status: 'Planning',
            startDate: '2024-03-01',
            endDate: '2024-08-15'
        },
        {
            id: 'p3',
            title: 'Internal Dashboard Tools',
            description: 'Building internal tools for analytics and user management.',
            status: 'Completed',
            startDate: '2023-09-01',
            endDate: '2023-12-20'
        }
    ];

    await Project.insertMany(projectsData.map(p => ({ ...p, officeId })));
    console.log(`Inserted ${projectsData.length} projects.`);

    // 4. Seed Tasks
    console.log('Seeding Tasks...');
    const tasksData = [];

    // Helper to create task
    const createTask = (id, title, type, status, projectId, parentId = null) => ({
        id,
        officeId,
        title,
        type,
        status,
        projectId,
        parentId,
        description: `Description for ${title}`,
        startDate: '2024-02-01',
        endDate: '2024-02-10'
    });

    // Project 1 Tasks
    // Epic 1
    tasksData.push(createTask('t1-e1', 'User Authentication System', 'Epic', 'In Progress', 'p1'));
    // Tasks for E1
    tasksData.push(createTask('t1-e1-t1', 'Login Page UI', 'Task', 'Completed', 'p1', 't1-e1'));
    tasksData.push(createTask('t1-e1-t2', 'OAuth Integration', 'Task', 'In Progress', 'p1', 't1-e1'));
    tasksData.push(createTask('t1-e1-t2-t1', 'Google Auth', 'Task', 'Completed', 'p1', 't1-e1-t2'));
    tasksData.push(createTask('t1-e1-t2-t2', 'GitHub Auth', 'Task', 'Pending', 'p1', 't1-e1-t2'));

    // Epic 2
    tasksData.push(createTask('t1-e2', 'Shopping Cart Experience', 'Epic', 'Pending', 'p1'));
    tasksData.push(createTask('t1-e2-t1', 'Cart State Management', 'Task', 'Pending', 'p1', 't1-e2'));

    // Bug
    tasksData.push(createTask('t1-b1', 'Fix checkout crash on Safari', 'Bug', 'Pending', 'p1'));

    // Project 2 Tasks
    tasksData.push(createTask('t2-e1', 'App Shell & Navigation', 'Epic', 'Brainstorming', 'p2'));
    tasksData.push(createTask('t2-e1-t1', 'Bottom Tab Bar', 'Task', 'Brainstorming', 'p2', 't2-e1'));

    await Task.insertMany(tasksData);
    console.log(`Inserted ${tasksData.length} tasks.`);

    // 5. Seed Notes
    console.log('Seeding Notes...');
    const notesData = [
        {
            title: 'Meeting Notes: Q1 Roadmap',
            content: '<p>Discussed key priorities for Q1:</p><ul><li>Performance Optimization</li><li>User Onboarding Flow</li></ul>',
            tags: ['planning', 'roadmap', 'q1']
        },
        {
            title: 'Design System Ideas',
            content: '<p>Standardize colors and typography across web and mobile.</p><p>Check out UI kits for inspiration.</p>',
            tags: ['design', 'ui', 'ux']
        },
        {
            title: 'Deployment Checklist',
            content: '<ol><li>Run tests</li><li>Build production assets</li><li>Check environment variables</li><li>Deploy to staging</li></ol>',
            tags: ['devops', 'deployment']
        },
        {
            title: 'Competitor Analysis',
            content: '<p>Reviewing main competitors X, Y, and Z. Key takeaways...</p>',
            tags: ['research', 'market']
        },
        {
            title: 'Team Outing Ideas',
            content: '<p>Bowling, Escape Room, or just dinner?</p>',
            tags: ['general', 'team']
        }
    ];

    await Note.insertMany(notesData.map(n => ({ ...n, officeId })));
    console.log(`Inserted ${notesData.length} notes.`);

    console.log('Success! Database seeded with realistic dummy data.');
    process.exit(0);
}

seed().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
