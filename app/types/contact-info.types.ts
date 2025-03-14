export interface ContactPerson {
    name: string;
    role: string;
    address: string;
    company: string;
    preferredContactType: string;
}

export interface Insurance {
    company: string;
    representative: string;
    pendingEstimates: number;
    pendingReimbursements: number;
    updates: string;
}

export interface CommunicationLog {
    type: string;
    date: string;
    user: string;
    description?: string;
    isAutomatic: boolean;
}

export interface EmailContact {
    email: string;
    isPrimary: boolean;
}

export interface AttachmentOption {
    name: string;
    category: string;
    checked?: boolean;
}

export interface ContactData {
    person: ContactPerson;
    insurance: Insurance;
    communicationLogs: CommunicationLog[];
    emailContacts: EmailContact[];
    attachmentOptions: AttachmentOption[];
}

export enum ContactMethod {
    email = "email",
    phone = "phone",
    message = "message"
}

export interface ContactInfoProps {
    preferredContactMethod?: ContactMethod;
    contactData?: ContactData;
}
