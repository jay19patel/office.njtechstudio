export const aiTemplates = {
    "website": {
        "title": "Website Redesign",
        "description": "A complete overhaul of the corporate website to improve user experience, SEO, and conversion rates.",
        "startDate": "2024-02-01",
        "endDate": "2024-04-30",
        "status": "Planning",
        "tasks": [
            {
                "id": "t_ai_1",
                "title": "Research & Strategy",
                "type": "Epic",
                "status": "Pending",
                "subtasks": [
                    { "id": "t_ai_1_1", "title": "Competitor Analysis", "type": "Story", "status": "Pending" },
                    { "id": "t_ai_1_2", "title": "User persona definition", "type": "Story", "status": "Pending" }
                ]
            },
            {
                "id": "t_ai_2",
                "title": "Design System",
                "type": "Epic",
                "status": "Pending",
                "subtasks": [
                    { "id": "t_ai_2_1", "title": "Typography & Color Palette", "type": "Task", "status": "Pending" },
                    { "id": "t_ai_2_2", "title": "Component Library", "type": "Task", "status": "Pending" }
                ]
            }
        ]
    },
    "mobile app": {
        "title": "Mobile App Development",
        "description": "Develop a cross-platform mobile application for iOS and Android.",
        "startDate": "2024-03-01",
        "endDate": "2024-06-30",
        "status": "Planning",
        "tasks": [
            {
                "id": "t_ai_3",
                "title": "Core Features",
                "type": "Epic",
                "status": "Pending",
                "subtasks": [
                    { "id": "t_ai_3_1", "title": "Authentication (Login/Signup)", "type": "Story", "status": "Pending" },
                    { "id": "t_ai_3_2", "title": "User Profile Management", "type": "Story", "status": "Pending" }
                ]
            },
            {
                "id": "t_ai_4",
                "title": "Backend Integration",
                "type": "Epic",
                "status": "Pending",
                "subtasks": [
                    { "id": "t_ai_4_1", "title": "API Setup", "type": "Task", "status": "Pending" }
                ]
            }
        ]
    },
    "marketing": {
        "title": "Q2 Marketing Campaign",
        "description": "Launch a digital marketing campaign to increase brand awareness.",
        "startDate": "2024-04-01",
        "endDate": "2024-06-30",
        "status": "Planning",
        "tasks": [
            {
                "id": "t_ai_5",
                "title": "Content Creation",
                "type": "Epic",
                "status": "Pending",
                "subtasks": [
                    { "id": "t_ai_5_1", "title": "Blog Posts", "type": "Story", "status": "Pending" },
                    { "id": "t_ai_5_2", "title": "Social Media Graphics", "type": "Story", "status": "Pending" }
                ]
            }
        ]
    },
    "default": {
        "title": "Enterprise SaaS Platform Launch",
        "description": "End-to-end development of a scalable enterprise SaaS solution, including market research, system architecture, MVP development, testing, and go-to-market strategy.",
        "startDate": "2024-03-01",
        "endDate": "2024-09-30",
        "status": "Planning",
        "tasks": [
            {
                "id": "t_def_1",
                "title": "Phase 1: Discovery & Requirements",
                "type": "Epic",
                "status": "Completed",
                "subtasks": [
                    { "id": "t_def_1_1", "title": "Stakeholder Interviews", "type": "Story", "status": "Completed" },
                    { "id": "t_def_1_2", "title": "Market Competitor Analysis", "type": "Story", "status": "Completed" },
                    {
                        "id": "t_def_1_3",
                        "title": "Define MVP Features Scope",
                        "type": "Task",
                        "status": "Completed",
                        "subtasks": [
                            { "id": "t_def_1_3_1", "title": "Draft PRD (Product Requirements Doc)", "type": "Task", "status": "Completed" },
                            { "id": "t_def_1_3_2", "title": "Sign-off from Product Manager", "type": "Task", "status": "Completed" }
                        ]
                    }
                ]
            },
            {
                "id": "t_def_2",
                "title": "Phase 2: System Architecture & Design",
                "type": "Epic",
                "status": "In Progress",
                "subtasks": [
                    { "id": "t_def_2_1", "title": "Database Schema Design (SQL/NoSQL)", "type": "Task", "status": "In Progress" },
                    { "id": "t_def_2_2", "title": "API Specification (OpenAPI/Swagger)", "type": "Task", "status": "Pending" },
                    { "id": "t_def_2_3", "title": "UI/UX High Fidelity Mockups", "type": "Story", "status": "In Progress" },
                    { "id": "t_def_2_4", "title": "Setup Cloud Infrastructure (AWS/GCP)", "type": "Task", "status": "Pending" }
                ]
            },
            {
                "id": "t_def_3",
                "title": "Phase 3: Development (Sprint 1-4)",
                "type": "Epic",
                "status": "Pending",
                "subtasks": [
                    {
                        "id": "t_def_3_1",
                        "title": "Authentication Module",
                        "type": "Story",
                        "status": "Pending",
                        "subtasks": [
                            { "id": "t_def_3_1_1", "title": "Implement OAuth2.0", "type": "Task", "status": "Pending" },
                            { "id": "t_def_3_1_2", "title": "Login/Signup Pages", "type": "Task", "status": "Pending" }
                        ]
                    },
                    { "id": "t_def_3_2", "title": "User Dashboard Implementation", "type": "Story", "status": "Pending" },
                    { "id": "t_def_3_3", "title": "Payment Gateway Integration (Stripe)", "type": "Story", "status": "Pending" }
                ]
            },
            {
                "id": "t_def_4",
                "title": "Phase 4: QA & Testing",
                "type": "Epic",
                "status": "Pending",
                "subtasks": [
                    { "id": "t_def_4_1", "title": "Unit Testing (Frontend/Backend)", "type": "Task", "status": "Pending" },
                    { "id": "t_def_4_2", "title": "Integration Testing", "type": "Task", "status": "Pending" },
                    { "id": "t_def_4_3", "title": "Fix Critical Bugs from Beta", "type": "Bug", "status": "Pending" }
                ]
            },
            {
                "id": "t_def_5",
                "title": "Phase 5: Launch & Marketing",
                "type": "Epic",
                "status": "Pending",
                "subtasks": [
                    { "id": "t_def_5_1", "title": "Prepare App Store Assets", "type": "Task", "status": "Pending" },
                    { "id": "t_def_5_2", "title": "Product Hunt Launch", "type": "Story", "status": "Pending" }
                ]
            }
        ]
    }
};
