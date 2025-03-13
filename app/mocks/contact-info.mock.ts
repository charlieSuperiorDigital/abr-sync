import { ContactData } from "../types/contact-info.types";

export const mockContactData: ContactData = {
    person: {
        name: "Jane Doe",
        role: "Vehicle Owner - Insured",
        address: "Main Street 1242",
        company: "ABC123",
        preferredContactType: "Phone Call"
    },
    insurance: {
        company: "Progressive",
        representative: "Aiden Moore",
        pendingEstimates: 34,
        pendingReimbursements: 23,
        updates: "-"
    },
    communicationLogs: [
        {
            type: "Email",
            date: "2025-02-20",
            user: "System",
            isAutomatic: true
        },
        {
            type: "Phone",
            date: "2025-02-19",
            user: "John Smith",
            isAutomatic: false
        }
    ],
    emailContacts: [
        {
            email: "alexander@email.com",
            isPrimary: true
        },
        {
            email: "aidenmoore@email.com",
            isPrimary: false
        }
    ],
    attachmentOptions: [
        { name: "Entire Workfile", category: "main" },
        { name: "Estimate", category: "main" },
        { name: "Final bill", category: "main" },
        { name: "Image report", category: "main" },
        { name: "Parts reconciliation", category: "main" },
        { name: "Repair Order Summary", category: "main" },
        { name: "Logs", category: "main" },
        { name: "Work Orders - by Labor Assignment", category: "additional" },
        { name: "Work Orders - by Technician", category: "additional" },
        { name: "Workfile cover sheet", category: "additional" },
        { name: "Vehicle & Insurance", category: "additional" },
        { name: "Notes & Attachments", category: "additional" },
        { name: "Quality Control", category: "additional" },
        { name: "Performance", category: "additional" }
    ]
};
