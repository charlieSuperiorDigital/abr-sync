'use client'

import { mockContactData } from '@/app/mocks/contact-info.mock'
import {
  ContactData,
  ContactInfoProps,
  ContactMethod,
} from '@/app/types/contact-info.types'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import { MessagesSquare, Phone } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCall } from '@/app/context/call-context'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import EmailModal from './email-modal'

export default function ContactInfo({
  preferredContactMethod,
  contactData: propContactData,
  selectedOpportunity,
}: ContactInfoProps) {
  const [shouldShowModal, setShouldShowModal] = useState(false)
  const { callOut } = useCall()
  const [selectedTab, setSelectedTab] = useState<'message' | 'email'>('message')
  const [contactData, setContactData] = useState<ContactData>(
    propContactData || mockContactData
  )
  const [selectedContactMethod, setSelectedContactMethod] =
    useState<ContactMethod | null>(null)

  useEffect(() => {
    if (propContactData) {
      setContactData(propContactData)
    }
  }, [propContactData])

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShouldShowModal(false)
      }
    }

    window.addEventListener('keydown', handleEscapeKey)
    return () => window.removeEventListener('keydown', handleEscapeKey)
  }, [])

  const handleSelectContactMethod = (method: ContactMethod) => {
    setSelectedContactMethod(method)
    if (method === ContactMethod.phone) {
      setShouldShowModal(true)
      callOut(`${process.env.NEXT_PUBLIC_RECIEVER_NUMBER}`) // make dynamic for client number
    }
    if (method === ContactMethod.email) {
      setSelectedTab('email')
    } else if (method === ContactMethod.message) {
      setSelectedTab('message')
    }
  }

  return (
    <>
      <div className="flex items-center h-full">
        <div className="flex items-center mr-3">
          <button
            onClick={() => handleSelectContactMethod(ContactMethod.message)}
            className={`flex items-center rounded-full transition-colors duration-100 group
                        ${preferredContactMethod === ContactMethod.message ? 'bg-black px-2' : 'hover:bg-black'}`}
            aria-label="Contact Information"
          >
            <span className="p-2">
              <MessagesSquare
                className={`w-6 h-6 ${preferredContactMethod === ContactMethod.message ? 'text-white' : 'text-black hover:text-white'}`}
              />
            </span>
            {preferredContactMethod === ContactMethod.message && (
              <span className="pr-3 text-xs font-bold text-white">PREF</span>
            )}
          </button>
        </div>
        <div className="flex items-center mr-3">
          <EmailModal contactData={contactData} />
        </div>
        <div className="flex items-center">
          <button
            onClick={() => handleSelectContactMethod(ContactMethod.phone)}
            className={`flex items-center rounded-full transition-colors duration-100 group
                        ${preferredContactMethod === ContactMethod.phone ? 'bg-black px-2' : 'hover:bg-black'}`}
            aria-label="Phone Contact"
          >
            <span className="p-2">
              <Phone
                className={`w-6 h-6 ${preferredContactMethod === ContactMethod.phone ? 'text-white' : 'text-black hover:text-white'}`}
              />
            </span>
            {preferredContactMethod === ContactMethod.phone && (
              <span className="pr-3 text-xs font-bold text-white">PREF</span>
            )}
          </button>
        </div>
      </div>
      <BottomSheetModal
        isOpen={shouldShowModal}
        onOpenChange={setShouldShowModal}
        title={
          selectedOpportunity
            ? `${selectedOpportunity.vehicleYear} ${selectedOpportunity.vehicleMake} ${selectedOpportunity.vehicleModel}`
            : ''
        }
      >
        {selectedOpportunity && (
          <OpportunityModal opportunityId={selectedOpportunity.opportunityId} />
        )}
      </BottomSheetModal>

      {/* {shouldShowModal && (
        <div
          className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50"
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
                <h3 className="mb-2 text-lg font-bold">
                  {contactData.person.name}, {contactData.person.role}
                </h3>
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
                <h3 className="mb-2 text-lg font-bold">
                  Insurance - {contactData.insurance.company}
                </h3>
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
                    <tr className="text-sm text-left">
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
                        <td className="flex items-center py-2">
                          {!log.isAutomatic && (
                            <div className="mr-2 w-6 h-6 bg-gray-200 rounded-full" />
                          )}
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
                          <input
                            type="checkbox"
                            className="mr-2 accent-black"
                            defaultChecked
                          />
                          Vehicle Owner
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2 accent-black"
                            defaultChecked
                          />
                          Insurance
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2 accent-black"
                          />
                          Custom
                        </label>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="mb-2">Message</p>
                      <textarea
                        className="p-3 w-full h-32 bg-gray-50 rounded-lg border"
                        placeholder="Type your message here..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-6">
                      <h4 className="mb-4 font-medium">Attach files</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          {contactData.attachmentOptions
                            .filter((opt) => opt.category === 'main')
                            .map((option, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center"
                              >
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="mr-2 accent-black"
                                    checked={selectedAttachments.includes(
                                      option.name
                                    )}
                                    onChange={() =>
                                      handleAttachmentToggle(option.name)
                                    }
                                  />
                                  <span className="ml-2">{option.name}</span>
                                </label>
                                <button className="text-sm underline">
                                  PREVIEW
                                </button>
                              </div>
                            ))}
                        </div>
                        <div className="space-y-3">
                          {contactData.attachmentOptions
                            .filter((opt) => opt.category === 'additional')
                            .map((option, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center"
                              >
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="mr-2 accent-black"
                                    checked={selectedAttachments.includes(
                                      option.name
                                    )}
                                    onChange={() =>
                                      handleAttachmentToggle(option.name)
                                    }
                                  />
                                  <span className="ml-2">{option.name}</span>
                                </label>
                                <button className="text-sm underline">
                                  PREVIEW
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 space-y-2">
                      {contactData.emailContacts.map((contact, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <div className="flex flex-1 items-center px-4 py-2 bg-gray-100 rounded-lg">
                            <span className="text-sm text-black">Email</span>
                            <input
                              type="email"
                              value={contact.email}
                              onChange={(e) =>
                                handleEmailChange(index, e.target.value)
                              }
                              className="flex-1 ml-2 bg-transparent outline-none"
                              placeholder="Enter email address"
                            />
                          </div>
                          {index > 0 && (
                            <button
                              className="p-2 rounded-lg hover:bg-gray-100"
                              onClick={() => handleRemoveEmail(index)}
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          )}
                          {index === contactData.emailContacts.length - 1 && (
                            <button
                              className="p-2 rounded-lg hover:bg-gray-100"
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
                        className="p-3 w-full h-32 bg-gray-50 rounded-lg border"
                        placeholder="Type your message here..."
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end p-6 border-t">
                  <button
                    onClick={handleSend}
                    className="px-6 py-2 text-white bg-black rounded-full transition-colors hover:bg-gray-800"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </>
  )
}
