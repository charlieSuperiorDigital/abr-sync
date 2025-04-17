'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Pencil } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [language, setLanguage] = useState('English') // Default language
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Debug: Log the session when modal opens
  console.log('EditProfileModal session:', session)

  // Mock user data - replace with actual user data from session when available
  const userData = {
    username: session?.user?.firstName && session?.user?.lastName 
      ? `${session.user.firstName} ${session.user.lastName}`
      : 'No name',
    role: session?.user?.roles?.join(', ') || 'No role assigned',
    phone:  'No phone number provided',
    email: session?.user?.email || 'No email',
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      // Close the modal
      onOpenChange(false)
      
      // Get the current locale from the URL for redirection after logout
      const locale = window.location.pathname.split('/')[1] || 'en'
      
      // Clear any local storage items that might contain sensitive information
      localStorage.removeItem('user-preferences')
      
      // Use NextAuth's signOut function with redirect: false to handle the redirect ourselves
      await signOut({ 
        redirect: false,
        callbackUrl: `/${locale}/login`
      })
      
      // Redirect to login page with the correct locale
      router.push(`/${locale}/login`)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
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
            <Avatar className="w-14 h-14">
              <AvatarImage src="/avatars/user-avatar.png" alt="User" />
              <AvatarFallback>
                {userData.username.split(' ').map(name => name[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <Pencil className="mr-1 w-3 h-3" /> Edit
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
                <Pencil className="mr-1 w-3 h-3" /> Edit
              </Button>
            </div>
          </div>

          <div className="flex p-1 bg-gray-100 rounded-full">
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
            className="justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <span className="text-xs">{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileModal
