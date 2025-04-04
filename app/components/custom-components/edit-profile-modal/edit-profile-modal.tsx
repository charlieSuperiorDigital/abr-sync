'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Pencil } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [language, setLanguage] = useState('English') // Default language

  // Mock user data - replace with actual user data from session when available
  const userData = {
    username: session?.user?.firstName && session?.user?.lastName 
      ? `${session.user.firstName} ${session.user.lastName}`
      : 'Gregory Smith',
    role: 'Technician',
    phone: '(111) 222-3333',
    email: session?.user?.email || 'gregorysmith@email.com',
  }

  const handleLogout = async () => {
    // Sign out and redirect to login page
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
    })
    
    // Get the current locale from the URL
    const locale = window.location.pathname.split('/')[1] || 'en'
    
    // Redirect to login page with the correct locale
    router.push(`/${locale}/login`)
  }

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    // Here you would implement the actual language change logic
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-14 w-14">
              <AvatarImage src="/avatars/user-avatar.png" alt="User" />
              <AvatarFallback>
                {userData.username.split(' ').map(name => name[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <Pencil className="mr-1 h-3 w-3" /> Edit
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Username</span>
              <span className="text-sm">{userData.username}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Role</span>
              <span className="text-sm">{userData.role}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Phone N°</span>
              <span className="text-sm">{userData.phone}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm">{userData.email}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Password</span>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <Pencil className="mr-1 h-3 w-3" /> Edit
              </Button>
            </div>
          </div>

          <div className="flex rounded-full bg-gray-100 p-1">
            <Button 
              variant={language === 'English' ? 'default' : 'ghost'} 
              className={`flex-1 rounded-full text-xs ${language === 'English' ? 'bg-black text-white' : ''}`}
              onClick={() => handleLanguageChange('English')}
            >
              English
            </Button>
            <Button 
              variant={language === 'Español' ? 'default' : 'ghost'} 
              className={`flex-1 rounded-full text-xs ${language === 'Español' ? 'bg-black text-white' : ''}`}
              onClick={() => handleLanguageChange('Español')}
            >
              Español
            </Button>
          </div>

          <Button 
            variant="ghost" 
            className="text-red-500 hover:text-red-700 hover:bg-red-50 justify-start"
            onClick={handleLogout}
          >
            <span className="text-xs">Log out</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileModal
