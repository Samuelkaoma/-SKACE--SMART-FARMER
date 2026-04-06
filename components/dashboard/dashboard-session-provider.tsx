'use client'

import { createContext, type ReactNode, useContext } from 'react'

interface DashboardSessionContextValue {
  userEmail: string | null
  userId: string
}

const DashboardSessionContext = createContext<DashboardSessionContextValue | null>(null)

export function DashboardSessionProvider({
  children,
  userEmail,
  userId,
}: DashboardSessionContextValue & {
  children: ReactNode
}) {
  return (
    <DashboardSessionContext.Provider
      value={{
        userEmail,
        userId,
      }}
    >
      {children}
    </DashboardSessionContext.Provider>
  )
}

export function useDashboardSession() {
  const context = useContext(DashboardSessionContext)

  if (!context) {
    throw new Error('useDashboardSession must be used within DashboardSessionProvider.')
  }

  return context
}
