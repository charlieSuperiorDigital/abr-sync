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
        { name: "Entire Workfile", category: "main", id: "1", size: "10MB" },
        { name: "Estimate", category: "main", id: "2", size: "10MB" },
        { name: "Final bill", category: "main", id: "3", size: "10MB" },
        { name: "Image report", category: "main", id: "4", size: "10MB" },
        { name: "Parts reconciliation", category: "main", id: "5", size: "10MB" },
        { name: "Repair Order Summary", category: "main", id: "6", size: "10MB" },
        { name: "Logs", category: "main", id: "7", size: "10MB" },
        { name: "Work Orders - by Labor Assignment", category: "additional", id: "8", size: "10MB" },
        { name: "Work Orders - by Technician", category: "additional", id: "9", size: "10MB" },
        { name: "Workfile cover sheet", category: "additional", id: "10", size: "10MB" },
        { name: "Vehicle & Insurance", category: "additional", id: "11", size: "10MB" },
        { name: "Notes & Attachments", category: "additional", id: "12", size: "10MB" },
        { name: "Quality Control", category: "additional", id: "13", size: "10MB" },
        { name: "Performance", category: "additional", id: "14", size: "10MB" }
    ]
};
