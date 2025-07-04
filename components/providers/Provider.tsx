'use client'

import { SessionProvider } from 'next-auth/react'
import React from 'react'



interface ProviderProps {
    children: React.ReactNode
}
const Provider:React.FC<ProviderProps> = ({children}) => {
  return (
    <SessionProvider>{children}</SessionProvider>
  )
}

export default Provider