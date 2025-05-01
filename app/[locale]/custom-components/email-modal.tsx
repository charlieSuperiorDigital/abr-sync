'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { DialogTitle } from '@radix-ui/react-dialog'
import apiService from '@/app/utils/apiService'
import { ContactData, AttachmentOption, CommunicationLog } from '@/app/types/contact-info.types'

// Define any additional interfaces needed
interface EmailItem {
  id: number
  address: string
}

interface Props {
  contactData: ContactData
}

export default function EmailModal({ contactData }: Props) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'message' | 'email'>('message')
  const [emails, setEmails] = useState<EmailItem[]>([])
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<string[]>(() => {
    return contactData.attachmentOptions
      .filter((option) => option.checked)
      .map((option) => option.name)
  })
  const [sentTo, setSentTo] = useState<string[]>([
    'Vehicle Owner',
    'Insurance',
    'Custom',
  ])

  const toggleFile = (file: string) => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles(selectedFiles.filter((f) => f !== file))
    } else {
      setSelectedFiles([...selectedFiles, file])
    }
  }

  const toggleSentTo = (recipient: string) => {
    if (sentTo.includes(recipient)) {
      setSentTo(sentTo.filter((r) => r !== recipient))
    } else {
      setSentTo([...sentTo, recipient])
    }
  }

  const addEmail = () => {
    const newId =
      emails.length > 0 ? Math.max(...emails.map((e) => e.id)) + 1 : 1
    setEmails([...emails, { id: newId, address: '' }])
  }

  const removeEmail = (id: number) => {
    setEmails(emails.filter((email) => email.id !== id))
  }

  const updateEmail = (id: number, address: string) => {
    setEmails(
      emails.map((email) => (email.id === id ? { ...email, address } : email))
    )
  }
  const handleSend = async () => {
    setError(null)
    const recipientEmails = emails
      .map((email) => email.address)
      .filter((address) => address.trim() !== '')

    if (activeTab === 'email' && recipientEmails.length === 0) {
      setError('Please add a valid mail')
      return
    }
    if (!message.trim()) {
      setError('Please the body should not be empty')
      return
    }

    setIsSending(true)

    try {
      for (const recipientEmail of recipientEmails) {
        const emailData = {
          from: 'officialauto360@gmail.com',
          to: recipientEmail,
          body: message,
          subject: '',
          //   attachments: selectedFiles,
        }

        const response = await apiService.post('/api/email', emailData)
        console.log(`Email succesfull: ${recipientEmail}`, response)
      }

      setEmails([])
      setMessage('')
      setSelectedFiles(
        contactData.attachmentOptions
          .filter((option) => option.checked)
          .map((option) => option.name)
      )
    } catch (err) {
      console.error('Error', err)
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while sending the email'
      )
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 w-auto h-auto bg-transparent hover:bg-transparent"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V8L12 13L22 8Z"
              fill="black"
            />
            <path d="M2 6L12 11L22 6" fill="black" />
            <path
              d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[1000px] p-0 gap-0 max-h-[90vh] overflow-auto bg-[#F0F0F0]">
        <div className="p-6 pb-0">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-[22px] font-semibold">
              Contact
            </DialogTitle>
          </div>

          <div className="mt-4">
            <h3 className="text-[20px] text-[#101010] font-semibold">
              {contactData.person.name}, Vehicle Owner - Insured
            </h3>

            <div className="grid grid-cols-3 gap-4 mt-8 text-sm">
              <div className="">
                <p className="text-[15px] font-medium mb-2">Address:</p>
                <p className="text-[15px]">{contactData.person.address}</p>
              </div>
              <div>
                <p className="text-[15px] font-medium mb-2">Company:</p>
                <p className="text-[15px]">{contactData.person.company}</p>
              </div>
              <div>
                <p className="text-[15px] font-medium mb-2">
                  Preferred Contact Type:
                </p>
                <p className="text-[15px]">
                  {contactData.person.preferredContactType}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-[20px] font-semibold">
              Insurance - {contactData.insurance.company}
            </h3>

            <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
              <div>
                <p className="text-[15px] font-medium mb-2">Representative</p>
                <p className="text-[15px]">
                  {contactData.insurance.representative}
                </p>
              </div>
              <div>
                <p className="text-[15px] font-medium mb-2">
                  Pending Estimates:
                </p>
                <p className="text-[15px]">
                  {contactData.insurance.pendingEstimates}
                </p>
              </div>
              <div>
                <p className="text-[15px] font-medium mb-2">
                  Pending Reimbursements:
                </p>
                <p className="text-[15px]">
                  {contactData.insurance.pendingReimbursements}
                </p>
              </div>
              <div>
                <p className="text-[15px] font-medium mb-2">Updates:</p>
                <p className="text-[15px]">{contactData.insurance.updates}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Communication logs</h3>
              {contactData.communicationLogs.length > 0 && (
                <button className="text-sm text-gray-500 hover:underline">
                  VIEW ALL
                </button>
              )}
            </div>

            <div className="mt-2">
              <div className="grid grid-cols-3 pb-1 text-sm text-gray-500 border-b">
                <div>TYPE</div>
                <div>DATE</div>
                <div>USER</div>
              </div>

              {contactData.communicationLogs.length === 0 ? (
                <div className="py-4 text-center text-gray-500">
                  There are no communication logs to show
                </div>
              ) : (
                contactData.communicationLogs.map((log, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 py-3 text-sm border-b"
                  >
                    <div>{log.type}</div>
                    <div>{log.date}</div>
                    <div className={log.isAutomatic ? '' : 'flex items-center'}>
                      {!log.isAutomatic && (
                        <div className="mr-2 w-5 h-5 bg-gray-300 rounded-full"></div>
                      )}
                      {log.isAutomatic ? 'Automatic' : log.user}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="relative h-[38px]  w-full max-w-[928px] rounded-full overflow-hidden bg-[#E3E3E3]">
              <div
                className={`absolute top-0 bottom-0 w-1/2 bg-black transition-transform duration-300 ease-in-out ${
                  activeTab === 'email'
                    ? 'translate-x-full rounded-l-full'
                    : 'rounded-r-full'
                }`}
              ></div>
              <div className="flex absolute top-0 right-0 bottom-0 left-0">
                <div
                  className="flex z-10 flex-1 justify-center items-center cursor-pointer"
                  onClick={() => setActiveTab('message')}
                >
                  <span
                    className={
                      activeTab === 'message'
                        ? 'text-white text-[15px]'
                        : 'text-[15px]'
                    }
                  >
                    Message
                  </span>
                </div>
                <div
                  className="flex z-10 flex-1 justify-center items-center cursor-pointer"
                  onClick={() => setActiveTab('email')}
                >
                  <span
                    className={
                      activeTab === 'email'
                        ? 'text-white text-[15px]'
                        : 'text-[15px]'
                    }
                  >
                    Email
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pt-4">
          <h3 className="text-[18px] font-medium mb-4">Attach files</h3>

          <div className="grid grid-cols-2 gap-y-4">
            {contactData.attachmentOptions.length === 0 ? (
              <div className="col-span-2 py-4 text-center text-gray-500">
                There are no attachment options to show
              </div>
            ) : (
              contactData.attachmentOptions.map((attachment, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center pr-4"
                >
                  <div className="flex items-center">
                    <Checkbox
                      id={`file-${index}`}
                      checked={selectedFiles.includes(attachment.name)}
                      onCheckedChange={() => toggleFile(attachment.name)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`file-${index}`}
                      className="text-sm cursor-pointer"
                    >
                      {attachment.name}
                    </label>
                  </div>
                  <button className="text-xs font-medium text-gray-500">
                    PREVIEW
                  </button>
                </div>
              ))
            )}
          </div>

          {activeTab === 'email' && (
            <>
              <div className="mt-6">
                <h3 className="text-[18px] font-medium mb-4">Sent to</h3>
                <div className="flex gap-4">
                  {['Vehicle Owner', 'Insurance', 'Custom'].map(
                    (recipient, index) => (
                      <div key={index} className="flex items-center">
                        <Checkbox
                          id={`recipient-${index}`}
                          checked={sentTo.includes(recipient)}
                          onCheckedChange={() => toggleSentTo(recipient)}
                          className="mr-2"
                        />
                        <label
                          htmlFor={`recipient-${index}`}
                          className="text-sm cursor-pointer"
                        >
                          {recipient}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {emails.length === 0 ? (
                  <div className="flex justify-center mt-2 mb-2">
                    <Button
                      variant="ghost"
                      onClick={addEmail}
                      className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                      <Plus className="mr-2 w-4 h-4" />
                      Add Email
                    </Button>
                  </div>
                ) : (
                  emails.map((email) => (
                    <div key={email.id} className="flex gap-2 items-center">
                      <div className="relative w-full max-w-[700px]">
                        <div className="flex items-center h-10 px-3 rounded-full bg-[#E3E3E3]">
                          <span className="text-[#1D1D1D] font-medium text-[15px]">
                            Email
                          </span>
                          <input
                            type="email"
                            value={email.address}
                            onChange={(e) =>
                              updateEmail(email.id, e.target.value)
                            }
                            className="flex-1 pl-2 text-right bg-transparent border-none focus:outline-none focus:ring-0"
                            placeholder=""
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEmail(email.id)}
                        className="w-8 h-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {email.id === emails[emails.length - 1].id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={addEmail}
                          className="w-8 h-8"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          <div className="mt-6">
            <div className="relative rounded-md bg-[#E3E3E3]">
              <div className="absolute top-3 left-3 text-[#1D1D1D] text-[15px] font-medium">
                Message
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[120px] pt-10 px-3 pb-3 bg-transparent border-none focus:outline-none focus:ring-0 resize-none"
                placeholder=""
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="px-8 rounded-full border-gray-300 w-full max-w-[250px] h-[45px]"
              disabled={isSending} // Deshabilitar el botón mientras se envía
            >
              Cancel
            </Button>
            <Button
              className="px-8 rounded-full bg-black hover:bg-gray-800 text-white w-full max-w-[250px] h-[45px]"
              onClick={handleSend}
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
