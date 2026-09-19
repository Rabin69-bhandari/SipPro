"use client"


import React from 'react'
import { AppSidebar } from '@/components/sidebar/AppSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { UserButton } from '@clerk/nextjs'

const DashboardClientWrapper = ({ children }) => {



  const isMobile = useIsMobile()
  return (
    <div>
      <SidebarProvider>

        <AppSidebar />

        <main className='flex flex-col w-full '>
          <header className='flex sticky top-0 z-100 bg-blue-50 w-full border-b min-h-15 items-center justify-between px-10'>
            {!isMobile && <SidebarTrigger />}

            <UserButton />
          </header>
          <div className='px-5 py-5 w-full h-full'>

          {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}

export default DashboardClientWrapper