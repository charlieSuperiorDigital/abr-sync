'use client';

import { mockContactData } from "@/app/mocks/contact-info.mock";
import { ContactData, ContactInfoProps, ContactMethod, CommunicationLog } from "@/app/types/contact-info.types";
import { Mail, MessagesSquare, Phone, Plus, Trash, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from 'react-toastify';

export default function ContactInfo({ preferredContactMethod, contactData: propContactData }: ContactInfoProps) {
    const [shouldShowModal, setShouldShowModal] = useState(false);
    const [selectedTab, setSelectedTab] = useState<'message' | 'email'>('message');
    const [contactData, setContactData] = useState<ContactData>(propContactData || mockContactData);
    const [selectedAttachments, setSelectedAttachments] = useState<string[]>([]);
    const [selectedContactMethod, setSelectedContactMethod] = useState<ContactMethod | null>(null);

    // Update contactData when prop changes
    useEffect(() => {
        if (propContactData) {
            setContactData(propContactData);
        }
    }, [propContactData]);

    const handleAttachmentToggle = (attachmentName: string) => {
        setSelectedAttachments(prev => 
            prev.includes(attachmentName)
                ? prev.filter(name => name !== attachmentName)
                : [...prev, attachmentName]
        );
    };

    const handleRemoveEmail = (index: number) => {
        if (contactData.emailContacts.length > 1) {
            setContactData(prev => ({
                ...prev,
                emailContacts: prev.emailContacts.filter((_, i) => i !== index)
            }));
        }
    };

    const handleAddEmail = () => {
        setContactData(prev => ({
            ...prev,
            emailContacts: [
                ...prev.emailContacts,
                { email: '', isPrimary: false }
            ]
        }));
    };

    const handleEmailChange = (index: number, value: string) => {
        setContactData(prev => ({
            ...prev,
            emailContacts: prev.emailContacts.map((contact, i) => 
                i === index ? { ...contact, email: value } : contact
            )
        }));
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setShouldShowModal(false);
        }
    };

    useEffect(() => {
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShouldShowModal(false);
            }
        };

        window.addEventListener('keydown', handleEscapeKey);
        return () => window.removeEventListener('keydown', handleEscapeKey);
    }, []);

    const handleSelectContactMethod = (method: ContactMethod) => {
        setShouldShowModal(true);
        setSelectedContactMethod(method);
        if (method === ContactMethod.email) {
            setSelectedTab('email');
        } else if (method === ContactMethod.message) {
            setSelectedTab('message');
        }
    };

    const handleSend = () => {
        const method = selectedContactMethod || preferredContactMethod;
        const attachmentText = selectedAttachments.length 
            ? ` with ${selectedAttachments.length} attachment${selectedAttachments.length > 1 ? 's' : ''}`
            : '';
            
        // Determine message context based on insurance updates
        let context = '';
        if (contactData.insurance.updates.includes('Pending')) {
            context = ' regarding pending insurance approval';
        } else if (contactData.insurance.updates.includes('Approved')) {
            context = ' to schedule repair work';
        } else if (contactData.insurance.updates.includes('Rejected')) {
            context = ' regarding estimate revision';
        }
            
        toast.success(
            `Message sent to ${contactData.person.name} via ${method}${attachmentText}${context}`, 
            {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            }
        );
        
        // Add to communication logs
        const newLog: CommunicationLog = {
            type: method?.toString() || 'message',
            date: new Date().toISOString(),
            user: "Current User", // This would come from auth context in real implementation
            isAutomatic: method === ContactMethod.email,
            description: `Message sent${attachmentText}${context}`
        };
        
        setContactData(prev => ({
            ...prev,
            communicationLogs: [newLog, ...prev.communicationLogs]
        }));
        
        setShouldShowModal(false);
        setSelectedAttachments([]);
    };

    return (
        <>
        <div className="flex items-center h-full">
            <div className="flex items-center mr-3">
                <button 
                    onClick={() => handleSelectContactMethod(ContactMethod.message)}
                    className={`flex items-center rounded-full transition-colors duration-100 group
                        ${preferredContactMethod === ContactMethod.message ? "bg-black px-2" : "hover:bg-black"}`}
                    aria-label="Contact Information"
                >
                    <span className="p-2">
                        <MessagesSquare 
                            className={`w-6 h-6 ${preferredContactMethod === ContactMethod.message ? "text-white" : "text-black hover:text-white"}`}
                        />
                    </span>
                    {preferredContactMethod === ContactMethod.message && (
                        <span className="pr-3 text-xs font-bold text-white">PREF</span>
                    )}
                </button>
            </div>
            <div className="flex items-center mr-3">
                <button 
                    onClick={() => handleSelectContactMethod(ContactMethod.email)}
                    className={`flex items-center rounded-full transition-colors duration-100 group
                        ${preferredContactMethod === ContactMethod.email ? "bg-black px-2" : "hover:bg-black"}`}
                    aria-label="Email Contact"
                >
                    <span className="p-2">
                        <Mail 
                            className={`w-6 h-6 ${preferredContactMethod === ContactMethod.email ? "text-white" : "text-black hover:text-white"}`}
                        />
                    </span>
                    {preferredContactMethod === ContactMethod.email && (
                        <span className="pr-3 text-xs font-bold text-white">PREF</span>
                    )}
                </button>
            </div>
            <div className="flex items-center">
                <button 
                    onClick={() => handleSelectContactMethod(ContactMethod.phone)}
                    className={`flex items-center rounded-full transition-colors duration-100 group
                        ${preferredContactMethod === ContactMethod.phone ? "bg-black px-2" : "hover:bg-black"}`}
                    aria-label="Phone Contact"
                >
                    <span className="p-2">
                        <Phone 
                            className={`w-6 h-6 ${preferredContactMethod === ContactMethod.phone ? "text-white" : "text-black hover:text-white"}`}
                        />
                    </span>
                    {preferredContactMethod === ContactMethod.phone && (
                        <span className="pr-3 text-xs font-bold text-white">PREF</span>
                    )}
                </button>
            </div>
        </div>

        {shouldShowModal && (
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={handleOverlayClick}
            >
                <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-bold">Contact</h2>
                        <button onClick={() => setShouldShowModal(false)} className="p-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1 p-6">
                        <div className="mb-6">
                            <h3 className="text-lg mb-2 font-bold">{contactData.person.name}, {contactData.person.role}</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm font-bold">Address:</p>
                                    <p>{contactData.person.address}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Company:</p>
                                    <p>{contactData.person.company}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Preferred Contact Type:</p>
                                    <p>{contactData.person.preferredContactType}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg mb-2 font-bold">Insurance - {contactData.insurance.company}</h3>
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm font-bold">Representative</p>
                                    <p>{contactData.insurance.representative}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Pending Estimates:</p>
                                    <p>{contactData.insurance.pendingEstimates}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Pending Reimbursements:</p>
                                    <p>{contactData.insurance.pendingReimbursements}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Updates:</p>
                                    <p>{contactData.insurance.updates}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold">Communication logs</h3>
                                <button className="text-sm">VIEW ALL</button>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm">
                                        <th className="pb-2">TYPE</th>
                                        <th className="pb-2">DATE</th>
                                        <th className="pb-2">USER</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contactData.communicationLogs.map((log, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="py-2">{log.type}</td>
                                            <td className="py-2">{log.date}</td>
                                            <td className="py-2 flex items-center">
                                                {!log.isAutomatic && <div className="w-6 h-6 rounded-full bg-gray-200 mr-2" />}
                                                {log.user}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <div className="flex mb-4 rounded-3xl">
                                <button 
                                    onClick={() => setSelectedTab('message')}
                                    className={`rounded-l-3xl flex-1 py-2 text-center ${selectedTab === 'message' ? 'bg-black text-white' : 'bg-gray-100'}`}
                                >
                                    Message
                                </button>
                                <button 
                                    onClick={() => setSelectedTab('email')}
                                    className={`rounded-r-3xl flex-1 py-2 text-center ${selectedTab === 'email' ? 'bg-black text-white' : 'bg-gray-100'}`}
                                >
                                    Email
                                </button>
                            </div>

                            {selectedTab === 'message' ? (
                                <>
                                    <div className="mb-4">
                                        <p className="mb-2">Sent to</p>
                                        <div className="flex gap-4">
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2 accent-black" defaultChecked />
                                                Vehicle Owner
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2 accent-black" defaultChecked />
                                                Insurance
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2 accent-black" />
                                                Custom
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="mb-2">Message</p>
                                        <textarea 
                                            className="w-full h-32 p-3 border rounded-lg bg-gray-50"
                                            placeholder="Type your message here..."
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <h4 className="font-medium mb-4">Attach files</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                {contactData.attachmentOptions
                                                    .filter(opt => opt.category === 'main')
                                                    .map((option, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <label className="flex items-center">
                                                            <input 
                                                                type="checkbox" 
                                                                className="mr-2 accent-black"
                                                                checked={selectedAttachments.includes(option.name)}
                                                                onChange={() => handleAttachmentToggle(option.name)}
                                                            />
                                                            <span className="ml-2">{option.name}</span>
                                                        </label>
                                                        <button className="text-sm underline">PREVIEW</button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="space-y-3">
                                                {contactData.attachmentOptions
                                                    .filter(opt => opt.category === 'additional')
                                                    .map((option, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <label className="flex items-center">
                                                            <input 
                                                                type="checkbox" 
                                                                className="mr-2 accent-black"
                                                                checked={selectedAttachments.includes(option.name)}
                                                                onChange={() => handleAttachmentToggle(option.name)}
                                                            />
                                                            <span className="ml-2">{option.name}</span>
                                                        </label>
                                                        <button className="text-sm underline">PREVIEW</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {contactData.emailContacts.map((contact, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-4 py-2">
                                                    <span className="text-sm text-black">Email</span>
                                                    <input 
                                                        type="email" 
                                                        value={contact.email}
                                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                                        className="flex-1 bg-transparent outline-none ml-2"
                                                        placeholder="Enter email address"
                                                    />
                                                </div>
                                                {index > 0 && (
                                                    <button 
                                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                                        onClick={() => handleRemoveEmail(index)}
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {index === contactData.emailContacts.length - 1 && (
                                                    <button 
                                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                                        onClick={handleAddEmail}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-4">
                                        <p className="mb-2">Message</p>
                                        <textarea 
                                            className="w-full h-32 p-3 border rounded-lg bg-gray-50"
                                            placeholder="Type your message here..."
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end p-6 border-t">
                                <button 
                                    onClick={handleSend}
                                    className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}