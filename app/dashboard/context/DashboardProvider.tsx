'use client'
import { ReactNode } from 'react'
import { TradingDayProvider } from './TradingDayContext'
import { ActivesProvider } from './ActivesContext'
import { Tabs } from '../components/tabs'

interface DashboardProviderProps {
  children: ReactNode
}

/**
 * Composite provider that sets up all necessary contexts for the dashboard.
 * Follows the pattern of lifting state into providers for dependency injection.
 */
export function DashboardProvider({ children }: DashboardProviderProps) {
  return (
    <TradingDayProvider>
      <ActivesProvider>
        <Tabs.Provider initialTab="operaciones">
          {children}
        </Tabs.Provider>
      </ActivesProvider>
    </TradingDayProvider>
  )
}
